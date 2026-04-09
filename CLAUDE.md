# Mint VPN — Project Overview

## Purpose

Mint VPN is a web-based subscription platform for selling VLESS VPN access. Users can register, purchase subscription plans, and manage their VPN connections through a clean, modern interface. Each subscription provides a unique link to the Remnwave control panel for device configuration and management.

## Vision

Build a fast, trustworthy, and conversion-optimized SaaS platform that makes purchasing and managing a VPN subscription as simple as possible. The experience should feel premium yet approachable — no clutter, no confusion, just a clear path from landing to active subscription.

## UX Goals

- **Zero friction onboarding**: Passwordless email-code authentication removes the barrier of password creation.
- **Clear purchase funnel**: Three-step flow (duration → payment method → pay) minimizes decision fatigue.
- **Instant gratification**: After payment, the subscription is immediately active and visible in the dashboard.
- **Self-service management**: Users can view details, check device limits, extend subscriptions, and access Remnwave panel — all from the dashboard.

## UI/UX Principles

- **Dark theme first**: Deep backgrounds (#0A0A0F), subtle gradients, soft glows.
- **Minimalism**: Every element earns its place. No decorative noise.
- **Conversion-focused**: Primary CTAs are prominent. The purchase flow is linear and distraction-free.
- **Trust signals**: Clean typography, consistent spacing, professional feel.
- **Mobile-first responsive**: Designed for phones first, scales gracefully to desktop.

## Frontend Architecture

### Stack

- **React 18+** with functional components and hooks
- **React Router v7** for client-side routing with layout routes
- **React Context + useReducer** for global state (auth, subscriptions)
- **CSS Modules** or **Styled Components** for scoped styling
- **Vite** as the build tool

### Project Structure

```
src/
  api/            # API service layer (mock implementations, easy to swap)
  assets/         # Static assets (icons, images)
  components/     # Reusable UI components (Button, Card, Input, Modal, etc.)
  context/        # React Context providers (AuthContext, SubscriptionContext)
  hooks/          # Custom hooks (useAuth, useSubscriptions, usePayment)
  layouts/        # Layout components (AppLayout, AuthLayout)
  mocks/          # Mock data and mock API handlers
  pages/          # Page components (Landing, Auth, Dashboard, Purchase, Payment, SubscriptionDetails)
  routes/         # Route configuration
  styles/         # Global styles, design tokens, theme
  utils/          # Utility functions
  App.jsx
  main.jsx
```

### State Management

State is managed via React Context + useReducer pattern:

- **AuthContext**: Manages user authentication state (current user, login/logout, email verification).
- **SubscriptionContext**: Manages subscription data (list, active subscription, purchase flow state).

Each context exports a Provider component and custom hooks (`useAuth`, `useSubscriptions`) for clean consumption.

### Routing

Routes are organized with layout nesting:

- `/` — Landing page (public)
- `/auth` — Auth layout
  - `/auth/login` — Email entry
  - `/auth/verify` — Code verification
- `/dashboard` — App layout (protected)
  - `/dashboard` — Subscription list
  - `/dashboard/purchase` — Purchase flow
  - `/dashboard/payment/:tariffId` — Payment processing
  - `/dashboard/subscription/:id` — Subscription details

Protected routes redirect unauthenticated users to `/auth/login`.

## Backend Integration Strategy

The frontend is built with a clean API service layer in `src/api/`. Currently, all functions return mock data. To integrate a real backend:

1. **Replace mock implementations** in `src/api/` with actual HTTP calls (fetch/axios).
2. **Auth flow**: Swap mock email/code verification with real API endpoints. Token storage in httpOnly cookies or secure localStorage.
3. **Subscriptions**: Replace mock subscription CRUD with REST or GraphQL endpoints.
4. **Payments**: Integrate real YooKassa, 0xProcessing, and CryptoBot SDKs/redirects in the payment service.
5. **WebSocket/SSE** (optional): For real-time subscription status updates after payment.

No component code should need to change — only the `src/api/` layer.

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint code
```
