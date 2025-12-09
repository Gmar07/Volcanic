# Volcanic Sushi & Sake pickup ordering

A Next.js pickup-only ordering experience with member accounts, favorites, and Stripe-powered card vaulting.

## Running locally

```bash
npm install
npm run dev
```

Environment variables:

- `AUTH_TOKEN_SECRET` – JWT secret for issuing member tokens (defaults to a dev value).
- `OWNER_ACCESS_CODE` – code owners enter to update menu items from the admin UI (defaults to `demo-owner-code`).
- `STRIPE_SECRET_KEY` – required for creating SetupIntents to vault customer payment methods. Skip if you only want to demo the UI.

Menu, user, favorites, and saved payment method metadata are persisted to the `data/` JSON files so the restaurant team can manage items without touching code.
