export const queryKeys = {
	me: ['auth', 'me'] as const,
	tariffs: ['tariffs'] as const,
	subscriptions: ['subscriptions', 'list'] as const,
	subscription: (id: string) => ['subscriptions', 'detail', id] as const,
} as const
