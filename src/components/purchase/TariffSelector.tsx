import { useTranslation } from 'react-i18next'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'
import type { Tariff } from '../../types'
import { Card } from '../ui/Card'
import { MAX_DEVICES } from '../../utils/constants'
import styles from './TariffSelector.module.css'

interface TariffSelectorProps {
	tariffs: Tariff[]
	selected: Tariff | null
	onSelect: (tariff: Tariff) => void
}

export function TariffSelector({
	tariffs,
	selected,
	onSelect,
}: TariffSelectorProps) {
	const { t } = useTranslation()
	const formatPrice = useCurrencyFormatter()
	return (
		<div className={styles.grid}>
			{tariffs.map(tariff => (
				<Card
					key={tariff.id}
					interactive
					selected={selected?.id === tariff.id}
					className={styles.card}
					onClick={() => onSelect(tariff)}
					role='radio'
					aria-checked={selected?.id === tariff.id}
					tabIndex={0}
					onKeyDown={e => e.key === 'Enter' && onSelect(tariff)}
				>
					{tariff.popular && (
						<span className={styles.popularBadge}>
							{t('purchase.tariff.popular')}
						</span>
					)}
					<div className={styles.nameRow}>
						<span className={styles.name}>{tariff.name}</span>
						<span className={styles.deviceBadge}>
							{t('purchase.tariff.devices', { count: MAX_DEVICES })}
						</span>
					</div>
					<div>
						<span className={styles.price}>{formatPrice(tariff)}</span>
						<span className={styles.priceSuffix}>
							{t('purchase.tariff.perDays', { days: tariff.durationDays })}
						</span>
					</div>
					<div className={styles.discountRow}>
						{tariff.discount ? (
							<span className={styles.discount}>
								{t('purchase.tariff.save', { pct: tariff.discount })}
							</span>
						) : null}
					</div>
					<div className={styles.features}>
						{tariff.features.filter(f => !/devices?/i.test(f)).map(f => (
							<span key={f} className={styles.feature}>
								<svg
									className={styles.featureCheck}
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth={2.5}
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M5 13l4 4L19 7'
									/>
								</svg>
								{f}
							</span>
						))}
					</div>
				</Card>
			))}
		</div>
	)
}
