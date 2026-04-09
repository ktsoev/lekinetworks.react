import type { Subscription } from '../types'
import { MAX_DEVICES } from '../utils/constants'
import { apiPost } from './http'

interface SiteVpnSubscriptionItem {
	device_id: number
	username: string
	subscription_url: string
	expire_at: string | null
	status: string
}

interface SiteSubscriptionOverviewResponse {
	site_user_id: number
	panel_telegram_id: string
	panel_reachable: boolean
	has_active_vpn: boolean
	subscriptions: SiteVpnSubscriptionItem[]
	payments: unknown[]
}

function tokenFromUrl(url: string): string {
	try {
		const u = new URL(url)
		const seg = u.pathname.split('/').filter(Boolean)
		return seg[seg.length - 1] ?? ''
	} catch {
		const seg = url.split('/').filter(Boolean)
		return seg[seg.length - 1] ?? ''
	}
}

const mapItem = (siteUserId: number, item: SiteVpnSubscriptionItem): Subscription => {
	const expiresAt = item.expire_at ?? new Date(0).toISOString()
	const expMs = new Date(expiresAt).getTime()
	const statusTail = item.status.split('.').pop() ?? item.status
	const isActive =
		statusTail === 'ACTIVE' && Number.isFinite(expMs) && expMs > Date.now()

	return {
		id: String(item.device_id),
		userId: String(siteUserId),
		tariffId: '',
		status: isActive ? 'active' : 'expired',
		createdAt: null,
		expiresAt,
		deviceLimit: MAX_DEVICES,
		devicesConnected: 0,
		subscriptionLink: item.subscription_url,
		subscriptionToken: tokenFromUrl(item.subscription_url),
	}
}

export const SubscriptionsService = {
	async list(): Promise<Subscription[]> {
		const overview = await apiPost<SiteSubscriptionOverviewResponse>(
			'/site/subscription/overview',
			{},
			true,
		)
		const subs = overview.subscriptions.map((item) =>
			mapItem(overview.site_user_id, item),
		)
		subs.sort(
			(a, b) =>
				({ active: 0, pending: 1, expired: 2 } as const)[a.status] -
					({ active: 0, pending: 1, expired: 2 } as const)[b.status] ||
				new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
		)
		return subs
	},

	async get(id: string): Promise<Subscription> {
		const overview = await apiPost<SiteSubscriptionOverviewResponse>(
			'/site/subscription/overview',
			{},
			true,
		)
		const item = overview.subscriptions.find((x) => String(x.device_id) === id)
		if (!item) throw new Error(`Subscription ${id} not found`)
		return mapItem(overview.site_user_id, item)
	},
}
