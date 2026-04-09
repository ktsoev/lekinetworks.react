import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { queryKeys } from '../api/queryKeys'
import { SubscriptionsService } from '../api/subscriptions'
import { TariffsService } from '../api/tariffs'
import { useAuth } from '../context/AuthContext'
import { SubscriptionSelector } from '../components/renew/SubscriptionSelector'
import { Button } from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/Loader'
import styles from './Renew.module.css'

export function Renew() {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { isAuthenticated } = useAuth()

	const { data: subscriptions = [], isPending } = useQuery({
		queryKey: queryKeys.subscriptions,
		queryFn: () => SubscriptionsService.list(),
		enabled: isAuthenticated,
	})

	const { data: tariffs = [] } = useQuery({
		queryKey: queryKeys.tariffs,
		queryFn: () => TariffsService.list(),
	})

	const active = subscriptions.filter(s => s.status === 'active')
	const tariffMap = Object.fromEntries(tariffs.map(tar => [tar.id, tar]))

	// Single active subscription — skip selection, go directly to renewal
	useEffect(() => {
		if (!isPending && active.length === 1) {
			navigate(`/dashboard/renew/${active[0].id}`, { replace: true })
		}
	}, [isPending, active.length, navigate])

	if (isPending) {
		return (
			<div className={styles.page}>
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</div>
		)
	}

	if (active.length === 0) {
		return (
			<div className={styles.page}>
				<div className={styles.empty}>
					<svg
						className={styles.emptyIcon}
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth={1.2}
					>
						<path
							d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					<h2 className={styles.emptyTitle}>{t('renew.empty.title')}</h2>
					<p className={styles.emptyDesc}>{t('renew.empty.desc')}</p>
					<Button onClick={() => navigate('/dashboard/purchase')}>
						{t('common.actions.buySubscription')}
					</Button>
				</div>
			</div>
		)
	}

	// active.length === 1 is handled by the redirect above.
	// This branch only renders when active.length > 1.
	return (
		<div className={styles.page}>
			<h1 className={styles.heading}>{t('renew.selectSub.heading')}</h1>
			<p className={styles.sub}>{t('renew.selectSub.sub')}</p>
			<SubscriptionSelector subscriptions={active} tariffMap={tariffMap} />
		</div>
	)
}
