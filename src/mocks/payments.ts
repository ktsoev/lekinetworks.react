import type { Payment, PaymentMethodInfo } from '../types';

export const mockPayments: Payment[] = [
  {
    id: 'pay_m1n2o3',
    userId: 'usr_a1b2c3d4',
    tariffId: 'tariff_3m',
    amount: 12.99,
    currency: 'USD',
    method: 'yookassa',
    status: 'completed',
    createdAt: '2026-01-15T11:55:00Z',
    completedAt: '2026-01-15T11:56:30Z',
    subscriptionId: 'sub_x1y2z3',
  },
];

export const paymentMethods: PaymentMethodInfo[] = [
  {
    id: 'yookassa',
    name: 'YooKassa',
    description: 'Credit card or bank transfer',
    icon: 'yookassa',
  },
  {
    id: '0xprocessing',
    name: '0xProcessing',
    description: 'Cryptocurrency payment',
    icon: 'crypto',
  },
  {
    id: 'cryptobot',
    name: 'CryptoBot',
    description: 'Pay via Telegram CryptoBot',
    icon: 'telegram',
  },
];
