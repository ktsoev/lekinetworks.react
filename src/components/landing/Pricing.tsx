import { useQuery } from '@tanstack/react-query'
import { motion, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { queryKeys } from '../../api/queryKeys'
import { TariffsService } from '../../api/tariffs'
import { useAuth } from '../../context/AuthContext'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'
import { mockTariffs } from '../../mocks/tariffs'
import { Container } from '../layout/Container'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './Pricing.module.css'

const containerVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.35, ease: 'easeOut' },
	},
}

export function Pricing() {
	const navigate = useNavigate()
	const { isAuthenticated } = useAuth()
	const { t } = useTranslation()
	const formatPrice = useCurrencyFormatter()
	const target = isAuthenticated ? '/dashboard/purchase' : '/auth/login'

	const { data: serverTariffs } = useQuery({
		queryKey: queryKeys.tariffs,
		queryFn: () => TariffsService.list(),
	})

	const tariffs =
		serverTariffs && serverTariffs.length > 0 ? serverTariffs : mockTariffs

	return (
		<section id='pricing' className={styles.section}>
			<Container>
				<h2 className={styles.heading}>{t('landing.pricing.heading')}</h2>
				<motion.div
					className={styles.grid}
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-80px' }}
				>
					{tariffs.map(tariff => (
						<motion.div key={tariff.id} variants={itemVariants}>
							<Card className={styles.card} selected={tariff.popular}>
								{tariff.popular && (
									<span className={styles.popularBadge}>
										{t('purchase.tariff.popular')}
									</span>
								)}
								<span className={styles.name}>{tariff.name}</span>
								<span className={styles.price}>{formatPrice(tariff)}</span>
								{tariff.discount && (
									<span className={styles.discount}>
										{t('purchase.tariff.save', { pct: tariff.discount })}
									</span>
								)}
								<Button
									full
									size='sm'
									variant={tariff.popular ? 'primary' : 'secondary'}
									className={styles.cta}
									onClick={() => navigate(target)}
								>
									{t('common.actions.choosePlan')}
								</Button>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	)
}
