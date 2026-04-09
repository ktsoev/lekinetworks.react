import { useTranslation } from 'react-i18next'
import type { Tariff } from '../types'

export function useCurrencyFormatter() {
	const { i18n } = useTranslation()
	const isRu = i18n.language.split('-')[0] === 'ru'

	return (tariff: Tariff): string => {
		if (isRu) {
			return new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: 'RUB',
				maximumFractionDigits: 0,
			}).format(tariff.priceRub)
		}
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(tariff.price)
	}
}
