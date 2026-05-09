# CustomerData Dashboard

A full-stack customer relationship management (CRM) dashboard built with **React**, **Node.js/Express**, and **PostgreSQL**, containerized with **Docker**. The application provides full CRUD operations for customers and their associated users, with a responsive UI featuring dark mode, advanced data tables, toast notifications, and client-side routing.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [High-Level Design (HLD)](#high-level-design-hld)
- [Low-Level Design (LLD)](#low-level-design-lld)
- [Architecture Diagrams](#architecture-diagrams)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Design Decisions](#design-decisions)

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, React Router DOM v6 |
| HTTP Client| Axios                                   |
| Icons      | Lucide React                            |
| Backend    | Node.js, Express 4                      |
| Database   | PostgreSQL 16                           |
| ORM/Driver | node-postgres (`pg`)                    |
| Container  | Docker, Docker Compose                  |
| Web Server | Nginx (production frontend serving)     |

---

## High-Level Design (HLD)

### System Overview

The system follows a classic **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                  React SPA (port 80 via Nginx)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (REST)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                             │
│              Node.js + Express API (port 5001)                  │
│         CORS-enabled · JSON middleware · Logging                │
└────────────────────────────┬────────────────────────────────────┘
                             │ TCP (pg pool)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│               PostgreSQL 16 (port 5432)                         │
│        customers table ←→ users table (FK cascade)              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Traits

- **Stateless REST API** — Every request carries all needed context; the server holds no session state.
- **Connection Pooling** — A `pg.Pool` with up to 20 connections prevents resource exhaustion under load.
- **Cascade Deletes** — `ON DELETE CASCADE` on the `users.customer_id` foreign key ensures referential integrity at the DB level, not the application level.
- **SPA Routing** — Nginx serves `index.html` for all routes (`try_files $uri /index.html`), enabling React Router's client-side navigation.
- **Environment-Driven Config** — All secrets (DB credentials, ports) are injected via environment variables; no hard-coded credentials in source code.
- **Health Checks** — Both backend and frontend Docker containers expose health-check endpoints consumed by Docker Compose `depends_on` conditions, preventing race-condition startup failures.

---

## Low-Level Design (LLD)

### Frontend Architecture

The frontend is a React SPA with a deliberate separation of concerns across four layers:

```
src/
├── pages/          ← Route-level components (orchestration only)
│   └── Dashboard.jsx
├── components/     ← Presentational / reusable UI components
│   ├── Layout.jsx          (sticky header, theme toggle, nav)
│   ├── DataTable.jsx       (generic sortable/filterable/paginated table)
│   ├── CustomerList.jsx    (DataTable config for customers)
│   ├── CustomerDetail.jsx  (customer info card + user table)
│   ├── UserTable.jsx       (DataTable config for users)
│   ├── AddCustomer.jsx     (create/edit customer modal)
│   └── AddUser.jsx         (create/edit user modal)
├── hooks/          ← Custom React Hooks (data-fetching logic)
│   └── useCustomers.js
├── services/       ← API client (all Axios calls in one place)
│   └── api.js
└── context/        ← React Context (cross-cutting concerns)
    └── ToastContext.jsx
```

#### Component Responsibility Matrix

| Component | Responsibility | State Owned |
|---|---|---|
| `Dashboard.jsx` | Route orchestration, modal visibility, handler wiring | `showAddModal`, `editingCustomer`, `showUserModal`, `editingUser` |
| `Layout.jsx` | Shell UI, sticky header, dark/light theme toggle | `theme` (persisted to `localStorage`) |
| `DataTable.jsx` | Generic table: sort, filter, search, pagination, column visibility | `sortConfig`, `filters`, `searchTerm`, `currentPage`, `pageSize`, `visibleColumns` |
| `CustomerList.jsx` | Columns config for customers; delegates rendering to `DataTable` | None (pure config) |
| `UserTable.jsx` | Columns config for users; delegates rendering to `DataTable` | None (pure config) |
| `useCustomers.js` | All async customer data operations | `customers[]`, `selectedCustomer`, `loading` |
| `ToastContext.jsx` | Global notification system | `toasts[]` (auto-cleared after 4 s) |

#### Data Flow (Read Path)

```
URL change (React Router)
       │
       ▼
Dashboard.jsx  ──useEffect──▶  useCustomers.loadCustomerDetails(id)
                                        │
                                        ▼
                               api.js: GET /api/customers/:id
                                        │
                               Axios response
                                        │
                                        ▼
                              setSelectedCustomer(data)
                                        │
                                        ▼
                          CustomerDetail renders with users[]
```

#### Data Flow (Write Path)

```
User submits AddCustomer form
       │
       ▼
AddCustomer.jsx calls api.createCustomer(formData)
       │
       ▼
POST /api/customers  →  Express  →  Customer.create()  →  PostgreSQL
       │
       ▼
onSuccess() callback fires in Dashboard.jsx
       │
  ┌────┴────────────┐
  ▼                 ▼
loadCustomers()   toast.success("Customer created!")
(refresh list)
```

---

### Backend Architecture

The backend follows the **MVC pattern** with a clean separation of routing, business logic, and data access:

```
server/
├── server.js               ← App bootstrap: CORS, middleware, routes, port binding
├── routes/
│   └── index.js            ← Express Router: maps HTTP verbs + paths to controllers
├── controllers/
│   ├── customerController.js  ← Request parsing, response shaping, error handling
│   └── userController.js
├── models/
│   ├── Customer.js            ← All SQL queries for customers (static class methods)
│   └── User.js                ← All SQL queries for users
├── config/
│   └── database.js            ← pg.Pool singleton, connection config from env vars
└── scripts/
    └── initDB.js              ← One-time DB bootstrap script (idempotent)
```

#### Request Lifecycle

```
Incoming HTTP Request
        │
        ▼
   server.js
   ├─ CORS middleware (whitelist origin check)
   ├─ express.json() (body parsing)
   ├─ Request logger (method, URL, origin, headers)
   └─ app.use('/api', routes)
              │
              ▼
        routes/index.js
        (verb + path → controller fn)
              │
              ▼
        controllers/*.js
        ├─ Extract params/body
        ├─ Call Model static method
        └─ Send JSON response / error
              │
              ▼
        models/*.js
        ├─ Parameterized SQL query ($1, $2 …)
        ├─ pool.query(sql, values)
        └─ Return rows[0] or rows
              │
              ▼
        PostgreSQL (via pg.Pool)
```

#### Error Handling Strategy

- Controllers wrap model calls in `try/catch` and return `500` with `{ error: message }`.
- The `getCustomerById` controller has **graceful degradation**: if the users sub-query fails, it returns the customer with an empty `users: []` rather than failing the entire request.
- The Axios client in `api.js` has a response interceptor that logs all API errors to the console without swallowing them.

---

## Architecture Diagrams

### Docker Compose Network Topology

```
                    Host Machine
  ┌───────────────────────────────────────────────────┐
  │                                                   │
  │   Port 80          Port 5001         Port 5432    │
  │      │                │                  │        │
  │      ▼                ▼                  ▼        │
  │  ┌────────┐      ┌─────────┐      ┌──────────┐    │
  │  │frontend│      │ backend │      │ database │    │
  │  │ Nginx  │─────▶│Express  │─────▶│Postgres  │    │
  │  │        │      │         │      │          │    │
  │  └────────┘      └─────────┘      └──────────┘    │
  │         customer-network (bridge)                 │
  │                                                   │
  └───────────────────────────────────────────────────┘

  Startup order (enforced by healthchecks):
  database (healthy) → backend (healthy) → frontend
```

### Frontend Component Tree

```
<BrowserRouter>
  <App>
    <ToastProvider>           ← Context: global toast state
      <Routes>
        <Route path="/">
          <Dashboard>         ← Orchestrator: all handlers live here
            <Layout>          ← Shell: header, theme, nav wrapper
              <CustomerList>  ← OR (based on route param)
                <DataTable>
              <CustomerDetail>
                <UserTable>
                  <DataTable>
              <AddCustomerModal>   ← Portaled modal (conditional render)
              <AddUserModal>       ← Portaled modal (conditional render)
            </Layout>
          </Dashboard>
        </Route>
      </Routes>
    </ToastProvider>
  </App>
</BrowserRouter>
```

### API Route Map

```
GET    /health                       → DB ping (Docker healthcheck)

GET    /api/customers                → List all customers (with user_count)
POST   /api/customers                → Create customer
GET    /api/customers/:id            → Get customer + nested users[]
PUT    /api/customers/:id            → Update customer name/country
DELETE /api/customers/:id            → Delete customer (cascades to users)

GET    /api/customers/:id/users      → List users for a customer
POST   /api/users                    → Create user (customer_id in body)
PUT    /api/users/:id                → Update user fields
DELETE /api/users/:id                → Delete user
```

---

## Project Structure

```
.
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom data-fetching hooks
│   │   ├── pages/              # Route-level page components
│   │   └── services/           # Axios API client
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js/Express backend
│   ├── config/                 # Database pool config
│   ├── controllers/            # Request handlers (MVC Controller)
│   ├── models/                 # SQL query layer (MVC Model)
│   ├── routes/                 # Express Router definitions
│   └── scripts/                # DB initialization script
│
├── database/
│   ├── Dockerfile              # PostgreSQL image with init script
│   └── init.sql                # Schema creation + seed data
│
├── Dockerfile.backend          # Multi-stage Node.js image
├── Dockerfile.frontend         # Multi-stage Nginx/React build
├── docker-compose.yml          # Orchestrates all three services
└── nginx.conf                  # SPA routing + gzip + caching headers
```

---

## Database Schema

```sql
-- customers
CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  country     VARCHAR(100),
  user_count  INTEGER DEFAULT 0,         -- denormalized for list performance
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- users
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL
              REFERENCES customers(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  age         INTEGER NOT NULL,
  role        VARCHAR(50) DEFAULT 'User', -- 'User' | 'Admin'
  country     VARCHAR(100) NOT NULL,
  gender      VARCHAR(20),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, name)              -- prevents duplicate users per customer
);

-- Indexes
CREATE INDEX idx_users_customer_id ON users(customer_id);
CREATE INDEX idx_customers_country  ON customers(country);
```

### Entity Relationship

```
customers ──────────────────── users
    │                             │
    │  PK: id                     │  PK: id
    │  name                       │  FK: customer_id → customers.id
    │  country                    │  name
    │  user_count                 │  age
    │  created_at                 │  role
    │  updated_at                 │  country
    │                             │  gender
    │                             │  created_at
    │                             │  updated_at
    │                             │
    └──── 1 ──────────── many ───-┘
              ON DELETE CASCADE
```

---

## API Reference

### Customers

#### `GET /api/customers`
Returns all customers with a live `user_count` aggregated via `LEFT JOIN`.

**Response `200`**
```json
[
  {
    "id": 1,
    "name": "ASM Technologies Ltd",
    "country": "India",
    "created_at": "2024-01-01T00:00:00.000Z",
    "user_count": 3
  }
]
```

#### `GET /api/customers/:id`
Returns a single customer with its `users` array embedded.

**Response `200`**
```json
{
  "id": 1,
  "name": "ASM Technologies Ltd",
  "country": "India",
  "created_at": "2024-01-01T00:00:00.000Z",
  "users": [
    { "id": 1, "name": "Amit Sharma", "age": 30, "role": "Admin", ... }
  ]
}
```

#### `POST /api/customers`
**Body:** `{ "name": "string", "country": "string" }`
**Response `201`:** Created customer object.

#### `PUT /api/customers/:id`
**Body:** `{ "name": "string", "country": "string" }`
**Response `200`:** Updated customer object.

#### `DELETE /api/customers/:id`
**Response `200`:** `{ "message": "Customer deleted successfully" }`
Cascades to delete all associated users.

### Users

#### `POST /api/users`
**Body:** `{ "customer_id": number, "name": string, "age": number, "role": "User"|"Admin", "country": string, "gender": string }`

#### `PUT /api/users/:id`
**Body:** Same fields as POST (excluding `customer_id`).

#### `DELETE /api/users/:id`
**Response `200`:** `{ "message": "User deleted successfully" }`

---

## Getting Started

### Prerequisites
- Docker Desktop ≥ 4.x
- Docker Compose v2

### Run with Docker (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd customer-dashboard

# Build and start all services
docker compose up --build

# App is available at:
#   Frontend → http://localhost
#   Backend  → http://localhost:5001
#   Database → localhost:5432
```

### Run Locally (Development)

```bash
# 1. Start the database
docker compose up database -d

# 2. Start the backend
cd server
cp .env.example .env        # set DB_USER, DB_PASSWORD, etc.
npm install
npm run dev                 # nodemon on port 5001

# 3. Start the frontend
cd client
npm install
npm run dev                 # Vite HMR on port 5173
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5001` | Backend HTTP port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `customer_dashboard` | Database name |
| `DB_USER` | *(required)* | Database user |
| `DB_PASSWORD` | *(required)* | Database password |
| `VITE_API_BASE_URL` | `http://localhost:5001/api` | Frontend API base URL |
