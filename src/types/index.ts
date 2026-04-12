// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
	id: number
	email: string
}

// ─── Tariff ──────────────────────────────────────────────────────────────────

export interface Tariff {
	id: string
	name: string
	durationDays: number
	price: number
	priceRub: number
	currency: string
	discount: number | null
	features: string[]
	popular: boolean
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = 'active' | 'expired' | 'pending'

export interface Subscription {
	id: string
	userId: string
	tariffId: string
	status: SubscriptionStatus
	createdAt: string | null
	expiresAt: string
	deviceLimit: number
	devicesConnected: number
	subscriptionLink: string
	subscriptionToken: string
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'completed' | 'failed'
export type PaymentMethod = 'yookassa' // | '0xprocessing' | 'cryptobot'

export interface Payment {
	id: string
	userId: string
	tariffId: string
	amount: number
	currency: string
	method: PaymentMethod
	status: PaymentStatus
	createdAt: string
	completedAt: string | null
	subscriptionId: string | null
}

export interface PaymentMethodInfo {
	id: PaymentMethod
	name: string
	description: string
	icon: string
}

export interface SiteCheckoutResponse {
	payment_id: string
	payment_url: string
	amount: number
	currency: string
	plan_key: string
	duration_days: number
}

// ─── Auth State ───────────────────────────────────────────────────────────────

export interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	pendingEmail: string | null
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
	id: string
	type: ToastType
	message: string
}
