import { useState } from 'react'
import type { PaymentMethod, Tariff } from '../types'

export type PurchaseStep = 1 | 2 | 3

export interface PurchaseState {
	step: PurchaseStep
	selectedTariff: Tariff | null
	selectedMethod: PaymentMethod | null
}

export function usePayment(initialTariff?: Tariff) {
	const [state, setState] = useState<PurchaseState>({
		step: initialTariff ? 2 : 1,
		selectedTariff: initialTariff ?? null,
		selectedMethod: null,
	})

	const selectTariff = (tariff: Tariff) =>
		setState(s => ({ ...s, selectedTariff: tariff }))

	const selectMethod = (method: PaymentMethod) =>
		setState(s => ({ ...s, selectedMethod: method }))

	const nextStep = () =>
		setState(s => ({ ...s, step: Math.min(s.step + 1, 3) as PurchaseStep }))

	const prevStep = () =>
		setState(s => ({ ...s, step: Math.max(s.step - 1, 1) as PurchaseStep }))

	const reset = () =>
		setState({ step: 1, selectedTariff: null, selectedMethod: null })

	return { ...state, selectTariff, selectMethod, nextStep, prevStep, reset }
}
