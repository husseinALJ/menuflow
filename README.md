<div align="center">

<img src="public/favicon.svg" width="80" height="80" alt="Sufra logo" />

# Sufra — Smart Restaurant Management & QR Ordering

**A full-stack restaurant platform where customers order by scanning a QR code, the kitchen sees live tickets, and cashiers close bills in one click.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-d97320?style=for-the-badge&logo=vercel)](https://menuflow-flame.vercel.app/)
[![Loom Walkthrough](https://img.shields.io/badge/Loom-Watch%20Demo-625DF5?style=for-the-badge&logo=loom)](https://www.loom.com/share/411c02b133fd41108133121f083353ea)
</div>

---

## Features

### Customer flow
- Scan a table QR code → instant session, no app download required
- Browse a live menu with categories, search, and availability status
- Add items, leave per-item notes, adjust quantities in-cart
- Place multiple orders throughout a meal
- View live order status (Pending → Preparing → Ready → Served)
- Request the bill or call a waiter with a single tap

### Kitchen Display System (KDS)
- Real-time order tickets pushed over WebSocket the moment a customer places an order
- Three-column Kanban view: Pending / Preparing / Ready
- Live elapsed-time counter on each ticket
- One-click status transitions; cancel button always visible
- Toast alert on every new incoming order

### Cashier & table management
- Visual table map with live occupancy status
- Real-time bill-request and waiter-call notifications with pulse indicators
- Full itemised bill per session, including multiple order rounds
- One-click checkout that closes the session and marks the table available
- Print receipt shortcut

### Admin dashboard
- Daily sales, order count, and active table stats
- All-time top-selling items leaderboard
- Full CRUD for menu items (with image URL, category, price, availability)
- Category management
- Table management with auto-generated QR codes
- Staff management — create/delete accounts with role assignment
- Order management with manual status overrides across all roles

### Auth & roles
- JWT-based authentication with 1-day expiry
- Four roles: `Admin`, `Chef`, `Waiter`, `Cashier`
- Route-level and controller-level role guards
- Passwords hashed with bcrypt; seed script bootstraps the first admin

---

## Tech stack

**Frontend**

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router_6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square&logo=zustand&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Socket.io Client](https://img.shields.io/badge/Socket.io_Client-010101?style=flat-square&logo=socketdotio)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=flat-square)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_4-010101?style=flat-square&logo=socketdotio)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod_4-3E67B1?style=flat-square)
![bcrypt](https://img.shields.io/badge/bcrypt-FF6B6B?style=flat-square)
![QRCode](https://img.shields.io/badge/qrcode-333333?style=flat-square)

**Infrastructure**

![Neon](https://img.shields.io/badge/Neon_DB-00E599?style=flat-square&logo=neon&logoColor=black)
![Vercel](https://img.shields.io/badge/Frontend%20--%20Vercel-000000?style=flat-square&logo=vercel)
![Vercel](https://img.shields.io/badge/Backend%20--%20Vercel-000000?style=flat-square&logo=vercel)

---
## Architecture

![Diagram](./docs/architecture-diagram.svg)


**Key data flow — placing an order:**

1. Customer scans QR → `POST /api/sessions/start` → session created, table marked Occupied
2. Customer submits cart → `POST /api/orders` → order + order items written to DB
3. Server emits `newOrder` to the `Chef` Socket.io room → ticket appears on KDS instantly
4. Chef changes status → `PUT /api/orders/:id/status` → server emits `statusUpdate` to `Waiter`, `Cashier`, and `table_{id}` rooms
5. Customer sees their order status update in real-time on `/bill/:sessionId`
6. Cashier clicks Checkout → `PUT /api/sessions/:id/checkout` → session closed, table freed

---

## Local setup

### Prerequisites

- Node.js ≥ 20.19
- A PostgreSQL database (local or [Neon](https://neon.tech) free tier)

### 1 — Backend setup

```bash
#Clone the backend repo
git clone https://github.com/hussainALJ/smart-rest-back.git
cd smart-rest-back
```

```bash
# Install dependencies
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=a_long_random_secret_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=yourStrongPassword123
FRONTEND_URL=http://localhost:5173
PORT=3000
```

```bash
# Run migrations
npx prisma migrate deploy

# Seed the first admin user
node prisma/seed.js

# Start the dev server
npm run dev
```

The API will be live at `http://localhost:3000`.

### 2 — Frontend setup

```bash
#Clone the frontend repo
git clone https://github.com/hussainALJ/menuflow.git
cd menuflow
```

```bash
# (in the frontend directory)
npm install

# Copy env
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Open `http://localhost:5173`.

### 3 — Try it out

| URL | What you see |
|-----|-------------|
| `/login` | Staff login page |
| `/admin` | Admin dashboard (login as seeded admin) |
| `/chef` | Kitchen display (login as Chef role) |
| `/cashier` | Cashier table map (login as Cashier) |
| `/menu?table=1` | Customer menu for table 1 (no login needed) |

To simulate the QR scan flow, visit `/menu?table=1` directly in a browser tab, add items, and place an order — it will appear on the KDS immediately if you have `/chef` open in another tab.

### Database schema (summary)

```
Users ──< (role: Admin | Chef | Waiter | Cashier)
Tables ──< Sessions ──< Orders ──< OrderItems >── MenuItems >── Categories
```

---

## Why I built this

Most restaurants I've seen either use paper tickets (slow, error-prone, illegible) or expensive proprietary POS systems that charge per terminal and lock you in. I wanted to prove that a lean, modern stack could replace all of that for a fraction of the cost.

The specific problems I set out to solve:

**Miscommunication between front-of-house and kitchen.** Verbal order-passing means items get lost or modified incorrectly. With Sufra, every order is written down the moment it's placed, and the kitchen sees it within milliseconds over a persistent WebSocket connection — no polling, no page refreshes.

**Friction in the ordering experience.** Making customers flag down a waiter to order, then flag them down again to request the bill, then wait for the terminal to come to the table adds 10–20 minutes to every dining experience. With a QR code on the table, the entire process is self-serve: order whenever you're ready, request the bill when you're done.

**Rigid role systems.** I built four distinct roles — Admin, Chef, Waiter, Cashier — each with a purpose-built interface. A chef never sees billing. A cashier never sees raw ingredient notes. Every route is guarded at the middleware level, not just the UI.

**Learning goals.** This project was also a deliberate exercise in: designing a real-time event model with Socket.io rooms (not just broadcast-everything), building Prisma-backed transactions (session start and table status update happen atomically), and shipping a polished, production-feel UI with Tailwind component classes defined once and reused everywhere.

The result is a system that could genuinely run a small-to-medium restaurant on day one, with zero ongoing license fees.

---

<div align="center">
  <sub>Built with ☕ by Hussein Al-Jassani</sub>
</div>