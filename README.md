# Wine Shop ERP (Backend)

Backend for a multi-store wine shop ERP: stores, products, expiry-tracked stock batches and orders, with role-based access.

> **Team project built at DivEcho Technologies (May 2026 - Oct 2026).** Shared here with the tech lead's permission. See [Who built what](#who-built-what).

## Tech stack
Node.js, Express, TypeScript, Prisma ORM, MySQL, Zod, JWT

## What it does
- **Orders:** an order, its items and a payment transaction record are written together in one database transaction. Stock is deducted per batch with an atomic conditional update, so an order fails (and rolls back) if there is not enough stock. Expiry and store access are validated.
- **Stores and stock:** store CRUD, store-wise products, and batches with expiry dates, with per-store admin/staff access and soft deletes.
- **Structure:** routes -> controllers -> models, Zod validation for request bodies, UUID-based public IDs, centralized error handling.

## Who built what
Based on the git history:

| Area | Built by |
|---|---|
| Orders, stores, store products, store product batches, products, brands, categories, product types, customers | **Nikita Yogi** |
| Authentication, users, roles and permissions, JWT, email, suppliers, purchase orders | Teammate |

Final merges were handled by the tech lead.

## Run locally
<!-- VERIFY these steps on a fresh clone before making the repo public -->
```bash
git clone <this repo>
cd wine-shop-erp
npm install
cp .env.example .env     # then fill in your own values
npx prisma migrate dev
npm run dev
```

Environment variables used by the code: `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` for emails.

## API modules
`auth`, `user`, `role`, `store`, `storeProduct`, `storeProductBatch`, `product`, `brand`, `category`, `productType`, `customers`, `supplier`, `purchaseOrder`, `order`

<!-- ADD: a Postman collection or a short list of main endpoints, and one screenshot of a successful order response -->
