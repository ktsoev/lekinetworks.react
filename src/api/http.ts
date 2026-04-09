import wretch, { type WretchOptions } from 'wretch'
import { retry, type RetryOptions } from 'wretch/middlewares'
import { AUTH_TOKEN_KEY } from '../utils/constants'

const DEFAULT_DEV_API = 'http://127.0.0.1:8080'

const basicWretchOptions: WretchOptions = {
	credentials: 'include',
	mode: 'cors',
}

const defaultRetryOptions: RetryOptions = {
	delayTimer: 500,
	delayRamp: (delay, nbOfAttempts) => delay * nbOfAttempts,
	maxAttempts: 2,
	until: (response) => {
		if (response) {
			if (response.ok || (response.status >= 400 && response.status <= 500)) {
				return true
			}
		}
		return false
	},
	retryOnNetworkError: true,
	resolveWithLatestResponse: false,
}

const $api = wretch(import.meta.env.VITE_API_URL || DEFAULT_DEV_API)
	.options(basicWretchOptions)
	.middlewares([retry(defaultRetryOptions)])
	.accept('application/json')

const authorizationBearer = (token: string): string => {
	const t = token.trim()
	if (/^bearer\s+/i.test(t)) return t
	return `Bearer ${t}`
}

const withAuth = (auth: boolean) => {
	if (!auth) return $api

	const token = sessionStorage.getItem(AUTH_TOKEN_KEY)?.trim()
	if (!token) return $api

	return $api.auth(authorizationBearer(token))
}

export const apiGet = async <T>(path: string, auth = false): Promise<T> =>
	withAuth(auth).url(path).errorType('json').get().json<T>()

export const apiPost = async <T>(path: string, body: unknown, auth = false): Promise<T> =>
	withAuth(auth).url(path).errorType('json').post(body).json<T>()
