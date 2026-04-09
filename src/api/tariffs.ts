import type { Tariff } from '../types'
import { apiGet } from './http'

interface SitePlanRow {
	plan_key: string
	name: string
	description: string | null
	amount: number
	duration_days: number
	amount_usdt: number | null
	sort_order: number
}

function mapPlan(row: SitePlanRow, popularKey: string | null): Tariff {
	const usdt = row.amount_usdt != null ? Number(row.amount_usdt) : 0
	const desc = (row.description ?? '').trim()
	return {
		id: row.plan_key,
		name: row.name,
		durationDays: row.duration_days,
		price: usdt,
		priceRub: row.amount,
		currency: 'USD',
		discount: null,
		features: desc
			? desc
					.split(/\r?\n/)
					.map(s => s.trim())
					.filter(Boolean)
			: [],
		popular: popularKey === row.plan_key,
	}
}

export const TariffsService = {
	async list(): Promise<Tariff[]> {
		const rows = await apiGet<SitePlanRow[]>('/site/plans', false)
		if (!rows?.length) return []
		const sorted = [...rows].sort(
			(a, b) =>
				a.sort_order - b.sort_order || a.plan_key.localeCompare(b.plan_key),
		)
		const popularKey = sorted[1]?.plan_key ?? sorted[0]?.plan_key ?? null
		return sorted.map(r => mapPlan(r, popularKey))
	},
}
