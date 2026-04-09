import { createContext, useCallback, useContext, useReducer } from 'react';
import type { Toast, ToastType } from '../types';
import { generateId } from '../utils/format';
import { TOAST_DURATION_MS } from '../utils/constants';

// ─── State ────────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string };

const reducer = (state: Toast[], action: Action): Toast[] => {
  switch (action.type) {
    case 'ADD':    return [...state, action.toast];
    case 'REMOVE': return state.filter((t) => t.id !== action.id);
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = generateId('toast');
    dispatch({ type: 'ADD', toast: { id, type, message } });
    setTimeout(() => dispatch({ type: 'REMOVE', id }), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
