import type { Subscription } from '../types';

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_x1y2z3',
    userId: 'usr_a1b2c3d4',
    tariffId: 'tariff_3m',
    status: 'active',
    createdAt: '2026-01-15T12:00:00Z',
    expiresAt: '2026-04-15T12:00:00Z',
    deviceLimit: 3,
    devicesConnected: 2,
    subscriptionLink: 'https://vpn.leki.example.com/ysJ-wyFrAH-uchfH',
    subscriptionToken: 'ysJ-wyFrAH-uchfH',
  },
  {
    id: 'sub_p4q5r6',
    userId: 'usr_a1b2c3d4',
    tariffId: 'tariff_1m',
    status: 'expired',
    createdAt: '2025-12-01T09:00:00Z',
    expiresAt: '2025-12-31T09:00:00Z',
    deviceLimit: 3,
    devicesConnected: 0,
    subscriptionLink: 'https://vpn.leki.example.com/ysJ-wyFrAH-uchfH',
    subscriptionToken: 'ysJ-wyFrAH-uchfH',
  },
];
