import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Subscription, Tariff } from '../../types'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { formatDate, getDaysRemaining } from '../../utils/format'
import styles from './SubscriptionSelector.module.css'

interface SubscriptionSelectorProps {
	subscriptions: Subscription[]
	tariffMap: Record<string, Tariff>
}

export function SubscriptionSelector({
	subscriptions,
	tariffMap,
}: SubscriptionSelectorProps) {
	const navigate = useNavigate()
	const { t } = useTranslation()

	return (
		<div className={styles.list}>
			{subscriptions.map(sub => {
				const tariff = tariffMap[sub.tariffId]
				const planTitle = tariff?.name || sub.tariffId || 'VPN'
				const daysLeft = getDaysRemaining(sub.expiresAt)

				return (
					<Card
						key={sub.id}
						interactive
						className={styles.card}
						onClick={() => navigate(`/dashboard/renew/${sub.id}`)}
						tabIndex={0}
						onKeyDown={e =>
							e.key === 'Enter' && navigate(`/dashboard/renew/${sub.id}`)
						}
						role='button'
						aria-label={t('renew.selectSub.ariaLabel', { plan: planTitle })}
					>
						<div className={styles.cardContent}>
							<div className={styles.cardHeader}>
								<span className={styles.plan}>
									{t('dashboard.card.plan', { name: planTitle })}
								</span>
								<Badge status={sub.status} />
							</div>

							<div className={styles.meta}>
								<span className={styles.metaItem}>
									<svg
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth={1.8}
										className={styles.metaIcon}
									>
										<rect x='3' y='4' width='18' height='18' rx='2' />
										<path d='M16 2v4M8 2v4M3 10h18' strokeLinecap='round' />
									</svg>
									{formatDate(sub.expiresAt)}
									{sub.status === 'active' && (
										<span className={styles.daysLeft}>· {daysLeft}d</span>
									)}
								</span>

							</div>
						</div>

						<svg
							className={styles.chevron}
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								d='M9 18l6-6-6-6'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</Card>
				)
			})}
		</div>
	)
}
