# Functional Specification

## Overview

Mint VPN is a single-page application for purchasing and managing VLESS VPN subscriptions. All data is mocked on the frontend. The architecture is designed for seamless backend integration later.

---

## Screens & Behavior

### 1. Landing Page

**Route**: `/`

**Purpose**: Convert visitors into users.

**Layout**: PublicLayout (header with logo + "Sign In" button, content area, minimal footer).

**Sections**:
- **Hero**: Headline ("Fast, Private, Secure VPN"), subtext describing the VLESS-based service, primary CTA "Get Started" → `/auth/login`.
- **Features**: 3-column grid (mobile: stacked). Icons + short titles: "VLESS Protocol", "3 Devices", "Instant Setup".
- **Pricing Preview**: Horizontal scroll or grid of tariff cards. Each shows duration, price, and savings badge. CTA "Choose Plan" → `/auth/login`.
- **FAQ**: Accordion with common questions (What is VLESS?, How many devices?, What payment methods?, How to connect?).

**Interactions**:
- All CTAs lead to `/auth/login` if not authenticated, or `/dashboard` if authenticated.
- Smooth scroll between sections via anchor links.

---

### 2. Login Page

**Route**: `/auth/login`

**Purpose**: Collect user's email for passwordless auth.

**Layout**: AuthLayout (centered card on dark background).

**Elements**:
- Logo at top
- Heading: "Welcome back" / "Get started"
- Email input field with validation (must be valid email format)
- "Continue" button (disabled until valid email entered)
- Subtle link "Back to home" → `/`

**Behavior**:
- On submit: call `authApi.sendCode(email)`.
- On success: store email in AuthContext as `pendingEmail`, navigate to `/auth/verify`.
- On error (future): show inline error message below input.
- If user is already authenticated, redirect to `/dashboard`.

---

### 3. Verify Page

**Route**: `/auth/verify`

**Purpose**: Verify the email code.

**Layout**: AuthLayout.

**Elements**:
- Heading: "Check your email"
- Subtitle: "We sent a 6-digit code to {pendingEmail}"
- 6-digit code input (individual boxes)
- 60-second countdown timer
- "Resend code" link (appears after countdown, resets on click)
- "Use a different email" link → `/auth/login`

**Behavior**:
- Each digit auto-focuses the next input box.
- Backspace moves focus to previous box.
- Paste support: pasting a 6-digit string fills all boxes.
- When all 6 digits entered: auto-submit by calling `authApi.verifyCode(email, code)`.
- Mock: any 6-digit code is accepted.
- On success: update AuthContext with user + token, navigate to `/dashboard`.
- On error (future): shake animation on inputs, "Invalid code" error message.
- If no `pendingEmail` in context, redirect to `/auth/login`.

---

### 4. Dashboard

**Route**: `/dashboard`

**Purpose**: Central hub for managing subscriptions.

**Layout**: AppLayout (header with logo + user email + logout, content area, mobile bottom nav).

**Elements**:
- Page title: "My Subscriptions"
- "Buy Subscription" button (top right, or prominent if empty state)
- Subscription cards list or empty state

**Empty State**:
- Illustration (shield icon or similar)
- "No active subscriptions"
- "Get your VPN subscription to stay private and secure"
- "Buy Subscription" primary button

**Subscription Card** (for each subscription):
- Plan name derived from tariffId (e.g., "3 Month Plan")
- Status badge: "Active" (green), "Expired" (red), "Pending" (yellow)
- Expiry date: "Expires Apr 15, 2026" or "Expired Dec 31, 2025"
- Device counter: icon + "2/3 devices"
- "Manage" button → `/dashboard/subscription/:id`

**Behavior**:
- On mount: call `subscriptionsApi.list()` to fetch subscriptions.
- Show skeleton loader while loading.
- Cards are sorted: active first, then pending, then expired.
- "Buy Subscription" → `/dashboard/purchase`.
- Logout clears AuthContext and navigates to `/`.

---

### 5. Purchase Page

**Route**: `/dashboard/purchase`

**Purpose**: Multi-step subscription purchase flow.

**Layout**: AppLayout.

**Elements**: Step indicator (1-2-3) at top, step-specific content below.

#### Step 1: Select Plan

- Heading: "Choose your plan"
- Grid of tariff cards (2 columns on mobile, 4 on desktop):
  - Plan name ("1 Month", "3 Months", etc.)
  - Price ("$12.99")
  - Savings badge if applicable ("Save 13%")
  - "Most Popular" badge on the popular tariff
  - Feature list (shared: VLESS, 3 devices, unlimited traffic)
- Selected card: accent border + glow
- "Continue" button at bottom (disabled until selection)

**Behavior**:
- Tap card to select (single selection).
- "Continue" advances to Step 2.
- Back navigation returns to dashboard.

#### Step 2: Payment Method

- Heading: "Select payment method"
- Radio-style cards for each method:
  - **YooKassa**: icon, "Credit card or bank transfer"
  - **0xProcessing**: icon, "Cryptocurrency payment"
  - **CryptoBot**: icon, "Pay via Telegram CryptoBot"
- Selected method: accent border
- "Continue" button (disabled until selection)

**Behavior**:
- Tap to select method.
- "Continue" advances to Step 3.
- "Back" returns to Step 1 (preserves plan selection).

#### Step 3: Confirm

- Heading: "Confirm your order"
- Summary card:
  - Plan: "3 Months"
  - Price: "$12.99"
  - Payment method: "YooKassa"
  - Devices: "Up to 3"
- "Pay $12.99" primary button
- "Back" returns to Step 2

**Behavior**:
- On "Pay" click: call `paymentsApi.create(tariffId, method)`.
- Navigate to `/dashboard/payment/:tariffId`.
- Disable button and show loading state during API call.

---

### 6. Payment Processing Page

**Route**: `/dashboard/payment/:tariffId`

**Purpose**: Simulate payment redirect and processing.

**Layout**: Minimal (centered content, no navigation).

**Elements**:
- Payment method logo/icon
- "Processing your payment..."
- Animated loader (pulsing or spinning)
- "Do not close this page" subtle text

**Behavior**:
- On mount: simulate a 2-3 second delay (mock payment processing).
- After delay: call `paymentsApi.getStatus(paymentId)` which returns "completed".
- Create new subscription in SubscriptionContext.
- Navigate to `/dashboard/payment/success`.

---

### 7. Payment Success Page

**Route**: `/dashboard/payment/success`

**Purpose**: Confirm successful payment and provide next steps.

**Layout**: Minimal centered layout.

**Elements**:
- Animated checkmark (SVG draw animation)
- "Payment Successful!"
- Subscription summary:
  - Plan name and duration
  - Expiry date
  - Device limit
- Two buttons:
  - "View Subscription" (primary) → `/dashboard/subscription/:newId`
  - "Go to Dashboard" (secondary) → `/dashboard`

**Behavior**:
- Auto-redirect to dashboard after 10 seconds if no interaction.
- Subscription data pulled from SubscriptionContext (newly created).

---

### 8. Subscription Details Page

**Route**: `/dashboard/subscription/:id`

**Purpose**: Full management view for a single subscription.

**Layout**: AppLayout.

**Elements**:

**Header Section**:
- Back button → `/dashboard`
- Plan name ("3 Month Plan")
- Status badge

**Status Card**:
- "Active" or "Expired" with colored indicator
- Days remaining: "20 days remaining" (countdown)
- Expiry date: "April 15, 2026"

**Devices Card**:
- "Connected Devices"
- Visual progress bar: 2/3
- "2 of 3 devices"

**Control Panel Card** (most prominent):
- "Subscription Control Panel"
- Description: "Configure your VPN connection, download configs, and manage devices"
- "Open Control Panel" button → opens `subscription.subscriptionLink` in new tab
- Copy link button (copies URL to clipboard with toast confirmation)

**Extend Subscription Card** (shown for both active and expired):
- "Extend your subscription"
- "Add more time to your current plan"
- "Extend" button → `/dashboard/purchase` (pre-selects the same tariff duration)

**Metadata Section** (collapsed/subtle):
- Subscription ID
- Created date
- Tariff type

**Behavior**:
- On mount: call `subscriptionsApi.get(id)` to fetch subscription details.
- Show skeleton loader while loading.
- "Open Control Panel" opens the Remnwave URL in a new tab (`window.open(subscriptionLink, '_blank')`).
- Copy link uses `navigator.clipboard.writeText()` with a success toast.
- "Extend" navigates to purchase flow. The purchase flow can accept a pre-selected tariff via route state.

---

## Global Behaviors

### Authentication Guard
- All `/dashboard/*` routes are protected.
- Unauthenticated access redirects to `/auth/login` with a return URL stored.
- After login, user is redirected back to the original URL.

### Session Management
- Auth token stored in localStorage (mock: static token string).
- On app load: check for token, if present call `authApi.getMe()` to restore session.
- Logout: clear token + AuthContext, redirect to `/`.

### Toast Notifications
- Appear top-right (or bottom-center on mobile).
- Auto-dismiss after 4 seconds.
- Types: success (green), error (red), info (blue).
- Used for: "Code sent!", "Link copied!", "Session expired", errors.

### Loading States
- All data fetching shows skeleton loaders matching the content shape.
- Buttons show inline spinners when actions are pending.
- Full-page loader for initial app bootstrap (checking auth).

### Error Handling (Future-Ready)
- API service layer wraps all calls in try/catch.
- Errors are propagated to components via state.
- Generic error component: "Something went wrong" with "Try Again" button.
- Network errors show a toast notification.

### Navigation
- **Mobile**: Bottom navigation bar with icons (Dashboard, Buy, Profile/Logout).
- **Desktop**: Header navigation with text links.
- Active route highlighted in nav.
- Smooth page transitions (fade + slide).
