# Frontend Structure

## Application Architecture

```
src/
├── api/
│   ├── auth.js              # Auth API (login, verify code, logout)
│   ├── subscriptions.js     # Subscription API (list, get, create, extend)
│   ├── payments.js          # Payment API (create payment, check status)
│   └── tariffs.js           # Tariff API (list available plans)
│
├── assets/
│   ├── icons/               # SVG icons (shield, devices, clock, etc.)
│   └── images/              # Logo, hero illustrations
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx       # Primary, secondary, ghost variants
│   │   ├── Input.jsx        # Text input with label, error state
│   │   ├── CodeInput.jsx    # 6-digit verification code input
│   │   ├── Card.jsx         # Content card with optional glow effect
│   │   ├── Badge.jsx        # Status badge (active, expired, pending)
│   │   ├── Modal.jsx        # Overlay modal with backdrop
│   │   ├── Loader.jsx       # Spinner / skeleton loader
│   │   ├── Toast.jsx        # Notification toast
│   │   └── Divider.jsx      # Horizontal divider
│   │
│   ├── layout/
│   │   ├── Header.jsx       # App header with logo and user menu
│   │   ├── Footer.jsx       # Minimal footer
│   │   ├── Sidebar.jsx      # Navigation sidebar (desktop)
│   │   ├── MobileNav.jsx    # Bottom navigation (mobile)
│   │   └── Container.jsx    # Max-width centered container
│   │
│   ├── auth/
│   │   ├── EmailForm.jsx    # Email input form for login
│   │   └── CodeForm.jsx     # Verification code form
│   │
│   ├── subscription/
│   │   ├── SubscriptionCard.jsx    # Subscription summary card
│   │   ├── SubscriptionStatus.jsx  # Status indicator with expiry
│   │   ├── DeviceCounter.jsx       # Device usage (e.g., 2/3)
│   │   └── SubscriptionLink.jsx    # Clickable link to Remnwave panel
│   │
│   ├── purchase/
│   │   ├── TariffSelector.jsx      # Duration/plan selection cards
│   │   ├── PaymentMethodSelector.jsx  # Payment method radio group
│   │   └── PurchaseSummary.jsx     # Order summary before payment
│   │
│   └── landing/
│       ├── Hero.jsx          # Hero section with CTA
│       ├── Features.jsx      # Feature highlights grid
│       ├── Pricing.jsx       # Pricing cards preview
│       └── FAQ.jsx           # Accordion FAQ section
│
├── context/
│   ├── AuthContext.jsx       # Auth state provider + useAuth hook
│   └── SubscriptionContext.jsx  # Subscription state provider + useSubscriptions hook
│
├── hooks/
│   ├── useAuth.js            # Auth operations (re-exported from context)
│   ├── useSubscriptions.js   # Subscription operations
│   ├── usePayment.js         # Payment flow state machine
│   └── useCountdown.js       # Countdown timer for code expiry
│
├── layouts/
│   ├── AppLayout.jsx         # Authenticated app shell (header, sidebar, content)
│   ├── AuthLayout.jsx        # Centered card layout for auth pages
│   └── PublicLayout.jsx      # Landing page layout (header, footer)
│
├── mocks/
│   ├── users.js              # Mock user data
│   ├── subscriptions.js      # Mock subscription data
│   ├── tariffs.js            # Mock tariff/plan data
│   └── delay.js              # Simulate network latency
│
├── pages/
│   ├── Landing.jsx           # Landing/marketing page
│   ├── Login.jsx             # Email entry page
│   ├── Verify.jsx            # Code verification page
│   ├── Dashboard.jsx         # Subscription list / home
│   ├── Purchase.jsx          # Multi-step purchase flow
│   ├── Payment.jsx           # Payment processing / redirect mock
│   ├── PaymentSuccess.jsx    # Post-payment confirmation
│   └── SubscriptionDetails.jsx  # Single subscription management
│
├── routes/
│   ├── index.jsx             # Route tree definition
│   └── ProtectedRoute.jsx    # Auth guard wrapper
│
├── styles/
│   ├── tokens.css            # CSS custom properties (design tokens)
│   ├── global.css            # Reset, base styles, typography
│   └── animations.css        # Shared keyframe animations
│
├── utils/
│   ├── format.js             # Date, currency formatting
│   ├── validators.js         # Email, code validation
│   └── constants.js          # App-wide constants
│
├── App.jsx                   # Root component with providers and router
└── main.jsx                  # Entry point, renders App
```

## Pages

### Landing (`/`)
Marketing page with hero section, feature highlights, pricing preview, and FAQ. Primary CTA leads to auth flow.

### Login (`/auth/login`)
Single input: email address. On submit, triggers mock email code send. Redirects to verify page.

### Verify (`/auth/verify`)
Six-digit code input with countdown timer. On successful verification, redirects to dashboard.

### Dashboard (`/dashboard`)
Lists all user subscriptions as cards. Each card shows status, expiry date, device count. Empty state with CTA to purchase. "Buy Subscription" button always visible.

### Purchase (`/dashboard/purchase`)
Multi-step form:
1. **Step 1 — Select Plan**: Grid of tariff cards (1 month, 3 months, 6 months, 12 months) with pricing.
2. **Step 2 — Payment Method**: Radio selection between YooKassa, 0xProcessing, CryptoBot.
3. **Step 3 — Confirm**: Summary of selection with "Pay" button.

### Payment (`/dashboard/payment/:tariffId`)
Mock payment processing page. Shows loading state, then simulates success after 2-3 seconds. Redirects to PaymentSuccess.

### Payment Success (`/dashboard/payment/success`)
Confirmation screen with animated checkmark. Shows subscription details summary. CTA to go to dashboard.

### Subscription Details (`/dashboard/subscription/:id`)
Full subscription management view:
- Status and expiry date
- Device counter (X/3)
- Subscription link (opens Remnwave panel)
- "Extend Subscription" button
- Subscription metadata (created date, plan type)

## Component Design Principles

- All UI components accept a `className` prop for composition.
- Interactive components support `disabled` and `loading` states.
- Form components are controlled (value + onChange).
- Cards and containers use consistent padding/border-radius from design tokens.
- All components are responsive by default.
