import type { PaymentMethod, SiteCheckoutResponse } from '../types'
import { apiPost } from './http'

function checkoutPath(method: PaymentMethod): string {
	switch (method) {
		case 'yookassa':
			return '/site/payment/checkout/yookassa'
		case 'cryptobot':
			return '/site/payment/checkout/cryptobot'
		case '0xprocessing':
			return '/site/payment/checkout/oxprocessing'
		default: {
			const _exhaustive: never = method
			return _exhaustive
		}
	}
}

export const PaymentsService = {
	/** Новая подписка (новый ключ). */
	async startNewCheckout(
		planKey: string,
		method: PaymentMethod,
		returnUrl: string,
		email?: string | null,
	): Promise<SiteCheckoutResponse> {
		return apiPost<SiteCheckoutResponse>(
			checkoutPath(method),
			{
				plan_key: planKey,
				return_url: returnUrl,
				extend: false,
				...(email?.trim() ? { email: email.trim() } : {}),
			},
			true,
		)
	},

	/** Продление существующей подписки для `device_id`. */
	async startRenewCheckout(
		planKey: string,
		method: PaymentMethod,
		returnUrl: string,
		deviceId: number,
		email?: string | null,
	): Promise<SiteCheckoutResponse> {
		return apiPost<SiteCheckoutResponse>(
			checkoutPath(method),
			{
				plan_key: planKey,
				return_url: returnUrl,
				extend: true,
				device_id: deviceId,
				...(email?.trim() ? { email: email.trim() } : {}),
			},
			true,
		)
	},
}
