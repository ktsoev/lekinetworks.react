import type { User } from '../types'
import { AUTH_TOKEN_KEY } from '../utils/constants'
import { apiGet, apiPost } from './http'

interface SiteTokenResponse {
	access_token: string
	token_type?: string
}

interface SiteMeResponse {
	id: number
	email: string
}

export const AuthService = {
	async sendCode(email: string): Promise<void> {
		await apiPost('/site/auth/request-code', { email }, false)
	},

	async verifyCode(email: string, code: string): Promise<{ user: User; token: string }> {
		const res = await apiPost<SiteTokenResponse>(
			'/site/auth/verify-code',
			{ email, code: code.trim() },
			false,
		)
		sessionStorage.setItem(AUTH_TOKEN_KEY, res.access_token)
		const user = await AuthService.getMe()
		return { user, token: res.access_token }
	},

	async logout(): Promise<void> {
		sessionStorage.removeItem(AUTH_TOKEN_KEY)
	},

	async getMe(): Promise<User> {
		const me = await apiGet<SiteMeResponse>('/site/auth/me', true)
		return { id: me.id, email: me.email }
	},
}
