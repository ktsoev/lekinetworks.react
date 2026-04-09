import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PaymentsService } from '../api/payments'
import { queryKeys } from '../api/queryKeys'
import { SubscriptionsService } from '../api/subscriptions'
import { TariffsService } from '../api/tariffs'
import { PaymentMethodSelector } from '../components/purchase/PaymentMethodSelector'
import { TariffSelector } from '../components/purchase/TariffSelector'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SkeletonCard } from '../components/ui/Loader'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter'
import { paymentMethods } from '../mocks/payments'
import type { PaymentMethod, PaymentMethodInfo, Tariff } from '../types'
import { CHECKOUT_HINT_KEY } from '../utils/constants'
import { formatDate, getDaysRemaining } from '../utils/format'
import styles from './RenewSubscription.module.css'

function methodsForTariff(tariff: Tariff): PaymentMethodInfo[] {
	return paymentMethods.filter(m => {
		if (m.id === 'yookassa') return tariff.priceRub > 0
		return tariff.price > 0
	})
}

export function RenewSubscription() {
	const { subscriptionId } = useParams<{ subscriptionId: string }>()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { isAuthenticated, user } = useAuth()
	const { toast } = useToast()
	const formatPrice = useCurrencyFormatter()

	const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null)
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

	const id = subscriptionId ?? ''

	const {
		data: sub,
		isPending: subLoading,
		isError: subError,
	} = useQuery({
		queryKey: queryKeys.subscription(id),
		queryFn: () => SubscriptionsService.get(id),
		enabled: Boolean(id) && isAuthenticated,
	})

	const { data: tariffs = [], isPending: tariffsLoading } = useQuery({
		queryKey: queryKeys.tariffs,
		queryFn: () => TariffsService.list(),
	})

	const availableMethods = useMemo(
		() => (selectedTariff ? methodsForTariff(selectedTariff) : paymentMethods),
		[selectedTariff],
	)

	const renewMutation = useMutation({
		mutationFn: (input: {
			planKey: string
			method: PaymentMethod
			deviceId: number
			email?: string | null
		}) =>
			PaymentsService.startRenewCheckout(
				input.planKey,
				input.method,
				`${window.location.origin}/dashboard/payment-success`,
				input.deviceId,
				input.email,
			),
		onSuccess: res => {
			window.location.assign(res.payment_url)
		},
		onError: () => {
			sessionStorage.removeItem(CHECKOUT_HINT_KEY)
			toast(t('renew.failed'), 'error')
		},
	})

	if (subError) {
		navigate('/dashboard/renew', { replace: true })
		return null
	}

	if (subLoading || tariffsLoading) {
		return (
			<div className={styles.page}>
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</div>
		)
	}

	if (!sub) return null

	const tariffMap = Object.fromEntries(tariffs.map(tar => [tar.id, tar]))
	const currentTariff = tariffMap[sub.tariffId]
	const planTitle = currentTariff?.name || sub.tariffId || 'VPN'
	const daysLeft = getDaysRemaining(sub.expiresAt)
	const deviceId = parseInt(sub.id, 10)
	const isDeviceIdValid = !isNaN(deviceId)

	const canPay =
		selectedTariff !== null &&
		selectedMethod !== null &&
		isDeviceIdValid &&
		availableMethods.some(m => m.id === selectedMethod)

	const handleRenew = () => {
		if (!selectedTariff || !selectedMethod || !isDeviceIdValid) return

		sessionStorage.setItem(
			CHECKOUT_HINT_KEY,
			JSON.stringify({
				planKey: selectedTariff.id,
				planName: selectedTariff.name,
				durationDays: selectedTariff.durationDays,
			}),
		)

		renewMutation.mutate({
			planKey: selectedTariff.id,
			method: selectedMethod,
			deviceId,
			email: user?.email ?? null,
		})
	}

	return (
		<div className={styles.page}>
			<button className={styles.backBtn} onClick={() => navigate(-1)}>
				← {t('common.actions.back')}
			</button>

			<div className={styles.header}>
				<h1 className={styles.heading}>{t('renew.heading')}</h1>
				<p className={styles.sub}>{t('renew.sub')}</p>
			</div>

			{/* Current subscription info */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>{t('renew.info.title')}</h2>
				<Card className={styles.infoCard}>
					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>{t('renew.info.plan')}</span>
						<span className={styles.infoValue}>{planTitle}</span>
					</div>
					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>{t('renew.info.status')}</span>
						<Badge status={sub.status} />
					</div>
					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>{t('renew.info.expires')}</span>
						<span className={styles.infoValue}>
							{formatDate(sub.expiresAt)}
							{sub.status === 'active' && (
								<span className={styles.daysLeft}>
									{' '}
									·{' '}
									{t('subscription.details.daysLeft', { count: daysLeft })}
								</span>
							)}
						</span>
					</div>
				</Card>
			</section>

			{/* Duration selection */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>{t('renew.sections.duration')}</h2>
				<TariffSelector
					tariffs={tariffs}
					selected={selectedTariff}
					onSelect={tariff => {
						setSelectedTariff(tariff)
						if (selectedMethod) {
							const methods = methodsForTariff(tariff)
							if (!methods.some(m => m.id === selectedMethod)) {
								setSelectedMethod(null)
							}
						}
					}}
				/>
			</section>

			{/* Payment method */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>{t('renew.sections.payment')}</h2>
				<PaymentMethodSelector
					methods={availableMethods}
					selected={selectedMethod}
					onSelect={setSelectedMethod}
				/>
			</section>

			{/* Actions */}
			<div className={styles.actions}>
				<Button
					variant='secondary'
					onClick={() => navigate(-1)}
					disabled={renewMutation.isPending}
				>
					{t('common.actions.cancel')}
				</Button>
				<Button
					onClick={handleRenew}
					loading={renewMutation.isPending}
					disabled={!canPay}
				>
					{canPay && selectedTariff
						? t('renew.cta', { amount: formatPrice(selectedTariff) })
						: t('renew.ctaDisabled')}
				</Button>
			</div>
		</div>
	)
}
