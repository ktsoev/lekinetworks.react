# User Flow

## Complete User Journey

```
Landing Page ──→ Login ──→ Verify Code ──→ Dashboard ──→ Purchase ──→ Payment ──→ Success ──→ Dashboard
                                              │                                                  │
                                              │                                                  │
                                              └──── Subscription Details ◄───────────────────────┘
                                                         │
                                                         ▼
                                                   Remnwave Panel
                                                   (external link)
```

## Flow Steps

### 1. Landing Page → Login

**Trigger**: User clicks "Get Started" or "Sign In" on the landing page.

**Action**: Navigates to `/auth/login`.

**What the user sees**: A centered card with a single email input field, a "Continue" button, and a brief tagline ("Enter your email to get started").

---

### 2. Login → Verify Code

**Trigger**: User enters a valid email and clicks "Continue".

**Action**:
- Frontend calls `api.auth.sendCode(email)` (mock: always succeeds, stores email in state).
- Navigates to `/auth/verify`.
- A 60-second countdown begins for code resend.

**What the user sees**: A 6-digit code input with the message "We sent a code to your@email.com". A "Resend code" link appears after countdown expires.

---

### 3. Verify Code → Dashboard

**Trigger**: User enters the correct 6-digit code (mock: any 6-digit input is accepted).

**Action**:
- Frontend calls `api.auth.verifyCode(email, code)` (mock: returns user object + token).
- AuthContext updates with authenticated user.
- Navigates to `/dashboard`.

**What the user sees**: Brief loading spinner, then the dashboard.

---

### 4. Dashboard — View Subscriptions

**What the user sees**:
- **If no subscriptions**: Empty state illustration with "You don't have any subscriptions yet" message and a prominent "Buy Subscription" button.
- **If subscriptions exist**: A list of subscription cards, each showing:
  - Plan name and status badge (Active / Expired / Pending)
  - Expiry date
  - Device counter (e.g., "2 of 3 devices")
  - "Manage" button → navigates to Subscription Details

A floating or fixed "Buy Subscription" button is always accessible.

---

### 5. Dashboard → Purchase Flow

**Trigger**: User clicks "Buy Subscription".

**Action**: Navigates to `/dashboard/purchase`.

**Step 1 — Select Plan**:
- User sees a grid of tariff cards:
  - 1 Month — $4.99
  - 3 Months — $12.99 (save 13%)
  - 6 Months — $23.99 (save 20%)
  - 12 Months — $41.99 (save 30%)
- User taps a card to select. Selected card gets a highlight border/glow.
- "Continue" button becomes active.

**Step 2 — Select Payment Method**:
- User sees payment method options:
  - YooKassa (card/bank payment)
  - 0xProcessing (crypto)
  - CryptoBot (Telegram-based crypto)
- Each option shows an icon and brief description.
- User selects one. "Continue" button activates.

**Step 3 — Confirm & Pay**:
- Summary card showing:
  - Selected plan and duration
  - Price
  - Payment method
- "Pay $X.XX" button.

---

### 6. Purchase → Payment Processing

**Trigger**: User clicks "Pay" on the confirmation step.

**Action**:
- Frontend calls `api.payments.createPayment(tariffId, method)`.
- Navigates to `/dashboard/payment/:tariffId`.

**What the user sees**: A loading screen with the payment method logo and "Processing your payment..." message. After 2-3 seconds (mock delay), transitions to success.

---

### 7. Payment → Success

**Trigger**: Mock payment completes successfully.

**Action**:
- Payment status updates to "completed".
- A new subscription is created in SubscriptionContext.
- Navigates to `/dashboard/payment/success`.

**What the user sees**:
- Animated checkmark icon.
- "Payment Successful!" heading.
- Subscription summary (plan, expiry date, device limit).
- Two CTAs: "Go to Dashboard" and "View Subscription".

---

### 8. Success → Dashboard (Updated)

**Trigger**: User clicks "Go to Dashboard".

**Action**: Navigates to `/dashboard`. The new subscription appears in the list with "Active" status.

---

### 9. Dashboard → Subscription Details

**Trigger**: User clicks "Manage" on a subscription card.

**Action**: Navigates to `/dashboard/subscription/:id`.

**What the user sees**:
- **Status section**: Active/Expired badge, days remaining counter.
- **Expiry date**: Formatted date.
- **Devices**: "2 of 3 devices connected" with a visual indicator.
- **Subscription link**: A prominent button/card labeled "Open Control Panel" that opens the Remnwave panel URL in a new tab.
- **Extend subscription**: Button that navigates back to the purchase flow pre-filled with the current plan.
- **Subscription metadata**: Created date, plan type, subscription ID.

---

### 10. Subscription Details → Remnwave Panel

**Trigger**: User clicks "Open Control Panel" or the subscription link.

**Action**: Opens the unique Remnwave panel URL (`https://panel.remnwave.com/sub/{subscriptionToken}`) in a new browser tab.

**What the user sees**: The external Remnwave panel where they can configure their VPN connection, download configs, and manage devices.

---

## Edge Cases

### Expired Subscription
- Status badge shows "Expired" in red/orange.
- "Extend Subscription" button is prominently shown.
- Subscription link may still be accessible but VPN service is inactive.

### Code Resend
- After 60 seconds, "Resend code" link appears.
- Clicking it resets the countdown and triggers a new mock code send.

### Session Expiry
- If the auth token is expired/missing, any protected route redirects to `/auth/login`.
- A toast notification says "Session expired. Please log in again."

### Payment Failure (Future)
- Mock always succeeds, but the UI includes a failure state: error message with "Try Again" and "Choose Different Method" options.
