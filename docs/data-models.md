# Data Models

## User

```typescript
interface User {
  id: string;                  // UUID, e.g. "usr_a1b2c3d4"
  email: string;               // User's email address
  createdAt: string;           // ISO 8601 timestamp
  lastLoginAt: string;         // ISO 8601 timestamp
}
```

### Mock Data

```javascript
const mockUser = {
  id: "usr_a1b2c3d4",
  email: "user@example.com",
  createdAt: "2025-11-15T10:30:00Z",
  lastLoginAt: "2026-03-26T08:00:00Z"
};
```

---

## Tariff

```typescript
interface Tariff {
  id: string;                  // e.g. "tariff_1m", "tariff_3m"
  name: string;                // Display name, e.g. "1 Month"
  durationDays: number;        // Duration in days
  price: number;               // Price in USD (or base currency)
  currency: string;            // "USD"
  discount: number | null;     // Discount percentage, e.g. 13, or null
  features: string[];          // Feature list for display
  popular: boolean;            // Highlight as "Most Popular"
}
```

### Mock Data

```javascript
const mockTariffs = [
  {
    id: "tariff_1m",
    name: "1 Month",
    durationDays: 30,
    price: 4.99,
    currency: "USD",
    discount: null,
    features: ["VLESS Protocol", "Up to 3 Devices", "Unlimited Traffic"],
    popular: false
  },
  {
    id: "tariff_3m",
    name: "3 Months",
    durationDays: 90,
    price: 12.99,
    currency: "USD",
    discount: 13,
    features: ["VLESS Protocol", "Up to 3 Devices", "Unlimited Traffic"],
    popular: true
  },
  {
    id: "tariff_6m",
    name: "6 Months",
    durationDays: 180,
    price: 23.99,
    currency: "USD",
    discount: 20,
    features: ["VLESS Protocol", "Up to 3 Devices", "Unlimited Traffic"],
    popular: false
  },
  {
    id: "tariff_12m",
    name: "12 Months",
    durationDays: 365,
    price: 41.99,
    currency: "USD",
    discount: 30,
    features: ["VLESS Protocol", "Up to 3 Devices", "Unlimited Traffic"],
    popular: false
  }
];
```

---

## Subscription

```typescript
type SubscriptionStatus = "active" | "expired" | "pending";

interface Subscription {
  id: string;                  // UUID, e.g. "sub_x1y2z3"
  userId: string;              // Reference to User.id
  tariffId: string;            // Reference to Tariff.id
  status: SubscriptionStatus;
  createdAt: string;           // ISO 8601 timestamp
  expiresAt: string;           // ISO 8601 timestamp
  deviceLimit: number;         // Max devices (always 3)
  devicesConnected: number;    // Currently connected devices
  subscriptionLink: string;    // Unique Remnwave panel URL
  subscriptionToken: string;   // Token embedded in the link
}
```

### Mock Data

```javascript
const mockSubscriptions = [
  {
    id: "sub_x1y2z3",
    userId: "usr_a1b2c3d4",
    tariffId: "tariff_3m",
    status: "active",
    createdAt: "2026-01-15T12:00:00Z",
    expiresAt: "2026-04-15T12:00:00Z",
    deviceLimit: 3,
    devicesConnected: 2,
    subscriptionLink: "https://panel.remnwave.com/sub/tk_abc123def456",
    subscriptionToken: "tk_abc123def456"
  },
  {
    id: "sub_p4q5r6",
    userId: "usr_a1b2c3d4",
    tariffId: "tariff_1m",
    status: "expired",
    createdAt: "2025-12-01T09:00:00Z",
    expiresAt: "2025-12-31T09:00:00Z",
    deviceLimit: 3,
    devicesConnected: 0,
    subscriptionLink: "https://panel.remnwave.com/sub/tk_old789ghi012",
    subscriptionToken: "tk_old789ghi012"
  }
];
```

---

## Payment

```typescript
type PaymentStatus = "pending" | "completed" | "failed";
type PaymentMethod = "yookassa" | "0xprocessing" | "cryptobot";

interface Payment {
  id: string;                  // UUID, e.g. "pay_m1n2o3"
  userId: string;              // Reference to User.id
  tariffId: string;            // Reference to Tariff.id
  amount: number;              // Payment amount
  currency: string;            // "USD"
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;           // ISO 8601 timestamp
  completedAt: string | null;  // ISO 8601 timestamp or null if not completed
  subscriptionId: string | null; // Created subscription ID, null until completed
}
```

### Mock Data

```javascript
const mockPayments = [
  {
    id: "pay_m1n2o3",
    userId: "usr_a1b2c3d4",
    tariffId: "tariff_3m",
    amount: 12.99,
    currency: "USD",
    method: "yookassa",
    status: "completed",
    createdAt: "2026-01-15T11:55:00Z",
    completedAt: "2026-01-15T11:56:30Z",
    subscriptionId: "sub_x1y2z3"
  }
];
```

---

## Auth State

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;  // Email awaiting code verification
}
```

---

## Payment Method Metadata

```typescript
interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;                // Display name
  description: string;         // Short description
  icon: string;                // Icon identifier
}
```

### Mock Data

```javascript
const paymentMethods = [
  {
    id: "yookassa",
    name: "YooKassa",
    description: "Credit card or bank transfer",
    icon: "yookassa"
  },
  {
    id: "0xprocessing",
    name: "0xProcessing",
    description: "Cryptocurrency payment",
    icon: "crypto"
  },
  {
    id: "cryptobot",
    name: "CryptoBot",
    description: "Pay via Telegram CryptoBot",
    icon: "telegram"
  }
];
```

---

## API Service Interface

All API functions follow this pattern for easy backend swap:

```typescript
// src/api/auth.js
export const authApi = {
  sendCode: async (email: string): Promise<{ success: boolean }>,
  verifyCode: async (email: string, code: string): Promise<{ user: User, token: string }>,
  logout: async (): Promise<void>,
  getMe: async (): Promise<User>
};

// src/api/subscriptions.js
export const subscriptionsApi = {
  list: async (): Promise<Subscription[]>,
  get: async (id: string): Promise<Subscription>,
  extend: async (id: string, tariffId: string): Promise<Subscription>
};

// src/api/payments.js
export const paymentsApi = {
  create: async (tariffId: string, method: PaymentMethod): Promise<Payment>,
  getStatus: async (paymentId: string): Promise<Payment>
};

// src/api/tariffs.js
export const tariffsApi = {
  list: async (): Promise<Tariff[]>
};
```
