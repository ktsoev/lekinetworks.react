import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from 'react'
import { AuthService } from '../api/auth'
import { queryKeys } from '../api/queryKeys'
import type { AuthState, User } from '../types'
import { AUTH_TOKEN_KEY } from '../utils/constants'

// ─── Pending email (редucer) ──────────────────────────────────────────────────

type PendingAction =
	| { type: 'SET_PENDING_EMAIL'; email: string }
	| { type: 'CLEAR_PENDING' }

function pendingReducer(
	_state: string | null,
	action: PendingAction,
): string | null {
	switch (action.type) {
		case 'SET_PENDING_EMAIL':
			return action.email
		case 'CLEAR_PENDING':
			return null
	}
}

function hasStoredToken(): boolean {
	return (
		typeof window !== 'undefined' && !!sessionStorage.getItem(AUTH_TOKEN_KEY)
	)
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
	sendCode: (email: string) => Promise<void>
	verifyCode: (email: string, code: string) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient()
	const [pendingEmail, dispatchPending] = useReducer(pendingReducer, null)

	const meQuery = useQuery({
		queryKey: queryKeys.me,
		queryFn: () => AuthService.getMe(),
		enabled: hasStoredToken(),
	})

	useEffect(() => {
		if (!meQuery.isError) return
		sessionStorage.removeItem(AUTH_TOKEN_KEY)
		queryClient.removeQueries({ queryKey: queryKeys.me })
	}, [meQuery.isError, queryClient])

	const user: User | null = meQuery.data ?? null
	const isAuthenticated = !!user
	const isLoading = hasStoredToken() && meQuery.isPending

	const sendCode = useCallback(async (email: string) => {
		await AuthService.sendCode(email)
		dispatchPending({ type: 'SET_PENDING_EMAIL', email })
	}, [])

	const verifyCode = useCallback(
		async (email: string, code: string) => {
			const { user: nextUser } = await AuthService.verifyCode(email, code)
			queryClient.setQueryData(queryKeys.me, nextUser)
			dispatchPending({ type: 'CLEAR_PENDING' })
		},
		[queryClient],
	)

	const logout = useCallback(async () => {
		await AuthService.logout()
		queryClient.removeQueries({ queryKey: queryKeys.me })
		queryClient.removeQueries({ queryKey: queryKeys.tariffs })
		queryClient.removeQueries({ queryKey: ['subscriptions'] })
		dispatchPending({ type: 'CLEAR_PENDING' })
	}, [queryClient])

	const value: AuthContextValue = {
		user,
		isAuthenticated,
		isLoading,
		pendingEmail,
		sendCode,
		verifyCode,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
