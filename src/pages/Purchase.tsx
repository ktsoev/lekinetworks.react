import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { PaymentsService } from '../api/payments'
import { queryKeys } from '../api/queryKeys'
import { TariffsService } from '../api/tariffs'
import { PaymentMethodSelector } from '../components/purchase/PaymentMethodSelector'
import { PurchaseSummary } from '../components/purchase/PurchaseSummary'
import { TariffSelector } from '../components/purchase/TariffSelector'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Loader'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter'
import { usePayment } from '../hooks/usePayment'
import { paymentMethods } from '../mocks/payments'
import type { PaymentMethod, PaymentMethodInfo, Tariff } from '../types'
import { CHECKOUT_HINT_KEY } from '../utils/constants'
import styles from './Purchase.module.css'

function methodsForTariff(tariff: Tariff): PaymentMethodInfo[] {
	return paymentMethods.filter(m => {
		if (m.id === 'yookassa') return tariff.priceRub > 0
		return tariff.price > 0
	})
}

export function Purchase() {
	const location = useLocation()
	const navigate = useNavigate()
	const { user } = useAuth()
	const { toast } = useToast()
	const { t } = useTranslation()

	const preselected = (location.state as { tariff?: Tariff })?.tariff
	const {
		step,
		selectedTariff,
		selectedMethod,
		selectTariff,
		selectMethod,
		nextStep,
		prevStep,
	} = usePayment(preselected)

	const formatPrice = useCurrencyFormatter()

	const {
		data: tariffs = [],
		isPending: loadingTariffs,
		isError: tariffsError,
	} = useQuery({
		queryKey: queryKeys.tariffs,
		queryFn: () => TariffsService.list(),
	})

	const checkoutMutation = useMutation({
		mutationFn: (input: {
			planKey: string
			method: PaymentMethod
			returnUrl: string
			email?: string | null
		}) =>
			PaymentsService.startNewCheckout(
				input.planKey,
				input.method,
				input.returnUrl,
				input.email,
			),
		onSuccess: res => {
			window.location.assign(res.payment_url)
		},
		onError: () => {
			sessionStorage.removeItem(CHECKOUT_HINT_KEY)
			toast(t('purchase.payFailed'), 'error')
		},
	})

	const availableMethods = useMemo(
		() => (selectedTariff ? methodsForTariff(selectedTariff) : paymentMethods),
		[selectedTariff],
	)

	useEffect(() => {
		if (tariffsError) toast(t('purchase.loadPlansFailed'), 'error')
	}, [tariffsError, t, toast])

	const handlePay = () => {
		if (!selectedTariff || !selectedMethod) return
		if (!availableMethods.some(m => m.id === selectedMethod)) {
			toast(t('purchase.payFailed'), 'error')
			return
		}
		sessionStorage.setItem(
			CHECKOUT_HINT_KEY,
			JSON.stringify({
				planKey: selectedTariff.id,
				planName: selectedTariff.name,
				durationDays: selectedTariff.durationDays,
			}),
		)
		checkoutMutation.mutate({
			planKey: selectedTariff.id,
			method: selectedMethod,
			returnUrl: `${window.location.origin}/dashboard/payment-success`,
			email: user?.email,
		})
	}

	const stepKeys = ['step1', 'step2', 'step3'] as const
	const stepLabels = stepKeys.map(k =>
		t(
			`purchase.steps.${k === 'step1' ? 'selectPlan' : k === 'step2' ? 'paymentMethod' : 'confirm'}`,
		),
	)

	return (
		<div className={styles.page}>
			<h1 className={styles.heading}>
				{t(`purchase.${stepKeys[step - 1]}.heading`)}
			</h1>
			<p className={styles.sub}>{t(`purchase.${stepKeys[step - 1]}.sub`)}</p>

			{/* Step indicator */}
			<div className={styles.steps} role='list'>
				{stepLabels.map((label, i) => {
					const num = i + 1
					const isActive = step === num
					const isDone = step > num
					return (
						<div key={num} className={styles.step} role='listitem'>
							<span
								className={[
									styles.stepNum,
									isActive ? styles.active : '',
									isDone ? styles.done : '',
								]
									.filter(Boolean)
									.join(' ')}
							>
								{isDone ? '✓' : num}
							</span>
							<span
								className={[styles.stepLabel, isActive ? styles.active : '']
									.filter(Boolean)
									.join(' ')}
							>
								{label}
							</span>
							{i < stepLabels.length - 1 && (
								<div className={styles.stepDivider} />
							)}
						</div>
					)
				})}
			</div>

			{/* Step content */}
			{step === 1 &&
				(loadingTariffs ? (
					<Spinner />
				) : (
					<TariffSelector
						tariffs={tariffs}
						selected={selectedTariff}
						onSelect={tariff => {
							selectTariff(tariff)
							nextStep()
						}}
					/>
				))}
			{step === 2 && (
				<PaymentMethodSelector
					methods={availableMethods}
					selected={selectedMethod}
					onSelect={selectMethod}
				/>
			)}
			{step === 3 && selectedTariff && selectedMethod && (
				<PurchaseSummary tariff={selectedTariff} method={selectedMethod} />
			)}

			{/* Actions */}
			<div className={styles.actions}>
				{step > 1 ? (
					<Button
						variant='secondary'
						onClick={prevStep}
						disabled={checkoutMutation.isPending}
					>
						{t('common.actions.back')}
					</Button>
				) : (
					<Button variant='secondary' onClick={() => navigate('/dashboard')}>
						{t('common.actions.cancel')}
					</Button>
				)}
				{step === 2 ? (
					<Button
						onClick={nextStep}
						disabled={!selectedMethod || availableMethods.length === 0}
					>
						{t('common.actions.continue')}
					</Button>
				) : step === 3 ? (
					<Button
						onClick={handlePay}
						loading={checkoutMutation.isPending}
						disabled={
							!selectedTariff ||
							!selectedMethod ||
							availableMethods.length === 0
						}
					>
						{t('common.actions.pay', {
							amount: selectedTariff ? formatPrice(selectedTariff) : '',
						})}
					</Button>
				) : null}
			</div>
		</div>
	)
}
