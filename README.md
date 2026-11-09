# Sri Lanka Destination Explorer

A full-stack destination guide for discovering Colombo, Kandy, Galle and other
places across Sri Lanka. Visitors can browse destinations and current weather;
the single administrator can manage destination records.

## Stack and features

- **Frontend:** Next.js App Router, React, TypeScript, responsive CSS.
- **API:** NestJS REST API, DTO validation, CORS and cookie-based admin sessions.
- **Database:** MongoDB Atlas with Mongoose (`@nestjs/mongoose`).
- **Weather:** Current conditions from Open-Meteo, requested by the API when a
  destination page is opened.
- **Deployment:** Separate Railway services for the frontend and backend, plus
  a Railway MongoDB service.

Visitors can browse `/` and `/destinations/:id` and check destination weather
without signing in. The administrator signs in at `/admin/login` and manages
destinations from `/admin` and the add/detail/edit pages under
`/admin/destinations`.
There are no visitor accounts; the single administrator is configured through
`ADMIN_EMAIL` and `ADMIN_PASSWORD`.
The backend exposes `/api/destinations`, `/api/destinations/:id`,
`/api/destinations/:id/weather`, and `/api/auth/{login,logout,me}`.

## Requirements

- Stable Node.js 22.12+ or Node.js 24.x and npm.
- A MongoDB Atlas cluster and database user. The app expects the URI in the
  backend environment; it does not contain or generate Atlas credentials.

## Run locally

Open two terminals from the repository root.

### 1. Configure and run the API

```powershell
Copy-Item backend\.env.example backend\.env
```

Edit `backend\.env` and replace `MONGODB_URI` with the connection string copied
from Atlas. Keep `MONGODB_DATABASE=sri_lanka_destination_explorer`. Replace the
admin password and session secret placeholders with your own values.

```powershell
cd backend
npm install
npm run start:dev
```

The API listens on `http://localhost:3001` when `PORT=3001` is set. On first
startup it creates the configured admin account (the password is stored as a
scrypt hash) and inserts 50 popular Sri Lankan destinations, including Colombo,
Kandy and Galle, if they are missing. Destination photos link to their
Wikimedia Commons attribution and license. Existing destination records are
preserved. The public destination gallery shows 10 cards per page.
`ADMIN_EMAIL`
and `ADMIN_PASSWORD` are the source of truth for the one administrator; if
either is changed, the existing admin credentials are synchronized on the
next successful API startup.

### 2. Run the website

In another terminal:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
cd frontend
npm install
npm run dev
```

The frontend's `frontend/.env.local` should point to the local REST API at
`http://localhost:3001/api` (this workspace already has that setting). Open
`http://localhost:3000`. If you see `rawHeaders.hasOwnProperty is not a
function`, check `node --version` in the frontend terminal and switch to
stable Node.js 24.x (or 22.12+) instead of an alpha release, then restart both
development servers. To use another API host, change
`NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the backend URL ending in
`/api` and restart the Next.js server.

### Connect the backend to your MongoDB Atlas cluster

Compass is a database client; the backend also needs its own MongoDB URI. Copy
the Atlas connection string into `backend/.env` (do not put it in frontend
configuration or source code).

1. In MongoDB Atlas, open the cluster and choose **Connect → Drivers**. Copy
   the Node.js connection string.
2. In Atlas **Database Access**, create or select a database user. In
   **Network Access**, add the current public IP address of the network where
   the backend runs for local development. A private address such as
   `192.168.x.x` is not the public egress address Atlas sees.
   For deployment, allow the backend host's network access according to its
   security guidance; avoid leaving access open to all IPs.
3. Edit `backend/.env` and set `MONGODB_URI` to the exact URI Atlas provides
   (if the password contains reserved URI characters, use the percent-encoded
   password Atlas expects). Keep `MONGODB_DATABASE` set to
   `sri_lanka_destination_explorer`. Keep the URI only in the backend `.env`;
   never put it in `frontend/.env.local`, frontend source, or a public
   `NEXT_PUBLIC_` variable. `.gitignore` excludes `.env` files.
4. Restart the backend so Mongoose loads the new URI. It creates the
   `sri_lanka_destination_explorer` database and collections when the app first
   writes data. At startup, the API inserts any missing destinations from its
   50-place Sri Lanka starter collection without replacing existing records.
5. In MongoDB Compass, choose **Add new connection**, paste the same Atlas URI,
   and connect. Expand `sri_lanka_destination_explorer` to view the
   `destinations` and `admins` collections after the app has
   written records. Compass and the app connect independently to the same
   cluster.

If opening the frontend from another device on your LAN, the backend listens
on all network interfaces. Set `NEXT_PUBLIC_API_URL` in
`frontend/.env.local` to the backend computer's reachable LAN address, for
example `http://<backend-lan-ip>:3001/api`, and set `FRONTEND_URL` in
`backend/.env` to the frontend's exact origin, for example
`http://<frontend-lan-ip>:3000`. Restart both development servers after
changing these values. The backend must also be able to reach Atlas; a browser
`ERR_CONNECTION_REFUSED` while Nest is reporting Atlas connection retries
means the API has not finished starting, so fix Atlas **Network Access** first.

### How the frontend, REST API and database work together

```text
Browser (Next.js)
  └── HTTP request to NEXT_PUBLIC_API_URL
      └── NestJS REST API (/api/...)
          └── Mongoose models and services
              └── MongoDB Atlas (configured by backend MONGODB_URI)
```

For example, the home page requests `GET /api/destinations`. The NestJS
destination controller calls its service, which queries MongoDB using
Mongoose, then returns JSON for the frontend to render. Admin create, edit and
delete actions use `POST`, `PATCH` and `DELETE` API requests. The browser sends
admin session cookies with requests; CORS allows the frontend origin from
`FRONTEND_URL`.

With both development servers running, verify the API from PowerShell:

```powershell
Invoke-RestMethod http://localhost:3001/api
Invoke-RestMethod http://localhost:3001/api/destinations
```

The first request should return the API health status; the second should
return destination records from the configured MongoDB database.

Choose your own `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters) and
`SESSION_SECRET` (at least 32 characters) in `backend/.env`. Example files
contain placeholders only; admin credentials and the session secret are never
embedded in application source.

## Environment variables

| Service | Variable | Purpose |
|---|---|---|
| Backend | `PORT` | HTTP port (Railway supplies this in production). |
| Backend | `NODE_ENV` | Set to `production` for secure production cookies. |
| Backend | `MONGODB_URI` | Atlas connection string (kept in the backend only). |
| Backend | `MONGODB_DATABASE` | Database name; defaults to `sri_lanka_destination_explorer`. |
| Backend | `FRONTEND_URL` | Allowed frontend origin(s), comma-separated. No trailing slash. |
| Backend | `ADMIN_EMAIL` | Email for the one seeded administrator. |
| Backend | `ADMIN_PASSWORD` | Configured admin password (minimum 12 characters). |
| Backend | `SESSION_SECRET` | Random signing key, at least 32 characters. |
| Frontend | `NEXT_PUBLIC_API_URL` | Public backend API URL ending with `/api`. |

Both `backend/.env.example` and `frontend/.env.example` are provided. Do not
commit `.env`, `.env.local`, or production secrets.

## Test admin credentials

The test admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in
the backend environment when the API starts. Set these values in
`backend/.env` for local testing and in the Railway backend service for the
deployed app. Provide the exact configured email and password with the
submission; the password is intentionally not stored in this repository.

## API overview

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api` | Public | Health check. |
| GET | `/api/destinations` | Public | List destinations. |
| GET | `/api/destinations/:id` | Public | Read one destination. |
| GET | `/api/destinations/:id/weather` | Public | Current weather for saved coordinates. |
| POST | `/api/auth/login` | Public | Log in and set an HttpOnly session cookie. |
| GET | `/api/auth/me` | Admin | Validate the current session. |
| POST | `/api/auth/logout` | Public | Clear the session cookie. |
| POST | `/api/destinations` | Admin | Create a destination. |
| PATCH | `/api/destinations/:id` | Admin | Update a destination. |
| DELETE | `/api/destinations/:id` | Admin | Delete a destination. |

Coordinates, text, category, location and optional HTTP(S) image URLs are
validated by the API. Destination documents include Mongoose-managed
`createdAt` and `updatedAt` timestamps.
Weather is not stored; Open-Meteo failures return an API error that the
destination page displays without hiding the destination.

## Tests and production build

```powershell
cd backend
npm test
npm run build

cd ..\frontend
npm run lint
npm run build
```

## Deploy on Railway

Create three Railway services: MongoDB, the NestJS API, and the Next.js
frontend. Deploy the `backend` and `frontend` folders as separate service
roots; each has its own Dockerfile. Give the API a public domain and configure:

**Backend service variables**

```text
NODE_ENV=production
MONGODB_URI=<MongoDB service connection URI>
MONGODB_DATABASE=sri_lanka_destination_explorer
FRONTEND_URL=https://<your-frontend-domain>
ADMIN_EMAIL=<demo admin email>
ADMIN_PASSWORD=<strong unique password>
SESSION_SECRET=<random secret of 32+ characters>
```

Railway supplies `PORT`. Set `MONGODB_URI` using the connection variable from
the Railway MongoDB service. Set the backend public domain and frontend domain
in `FRONTEND_URL` / `NEXT_PUBLIC_API_URL` respectively.

**Frontend service variable**

```text
NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api
```

The frontend API URL is public and is compiled into the Next.js bundle; set it
before building or redeploy the frontend after changing it. Once the API can
connect to MongoDB, its first startup seeds 50 popular Sri Lanka destinations and
creates the configured admin. Verify `/api`, public destination pages, admin
login/logout, all CRUD actions, and live weather against the deployed URLs.

Deployment cannot be performed from this repository workspace without access
to the submitter's Railway project, domain and production secrets.

## Project map

### What each part does

| File or folder | Content |
|---|---|
| `frontend/src/app/page.tsx` | Public home page with destination browsing and no-sign-in messaging. |
| `frontend/src/app/destinations/[id]/page.tsx` | Public destination detail page, with a photo gallery, full description, visitor notes, location and weather. |
| `frontend/src/app/admin/` | Admin sign-in, dashboard, and destination create, detail and edit pages. |
| `frontend/src/app/layout.tsx` | Site-wide HTML layout and browser metadata/title. |
| `frontend/src/app/globals.css` | Shared page layout, colors, typography and responsive styling. |
| `frontend/src/components/` | Reusable site header, destination cards with summaries, destination gallery and forms, hero background and weather panel. |
| `frontend/src/lib/` | API request helpers, destination display helpers and shared TypeScript types. |
| `frontend/public/` | Hero and destination images used by the website. |
| `backend/src/destinations/` | Destination API routes, persistence logic, validation DTO and MongoDB schema. |
| `backend/src/auth/` | Single-admin authentication, protected API guard, admin schema and login DTO. |
| `backend/src/weather/` | Weather lookup service for destination coordinates. |
| `backend/src/main.ts`, `app.module.ts` | API startup and NestJS module/database configuration. |
| `backend/test/`, `backend/src/**/*.spec.ts` | API end-to-end and unit tests. |
| `frontend/.env.example`, `backend/.env.example` | Example configuration keys; put local secrets in ignored `.env` files. |

### Copyable project structure

This source-oriented tree omits generated output (`node_modules`, `.next`, and
`dist`) and local secret files (`.env`, `.env.local`).

```text
sri-lanka-destination-explorer/
├── README.md
├── frontend/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── public/
│   │   ├── sri-lanka-hero.png
│   │   └── destinations/
│   │       ├── galle-fort.png
│   │       ├── nine-arch-bridge.png
│   │       ├── sigiriya.png
│   │       ├── colombo-lotus-tower.png
│   │       ├── temple-of-the-tooth.png
│   │       └── destination-placeholder.svg
│   └── src/
│       ├── app/
│       │   ├── page.tsx                 # Home page
│       │   ├── layout.tsx               # Site title and root layout
│       │   ├── globals.css              # Global styling
│       │   ├── not-found.tsx            # Destination/page not found
│       │   ├── error.tsx                # Error boundary
│       │   ├── destinations/[id]/page.tsx
│       │   └── admin/
│       │       ├── page.tsx             # Destination management dashboard
│       │       ├── login/page.tsx       # Admin login
│       │       └── destinations/
│       │           ├── new/page.tsx     # Add destination
│       │           ├── new/new-destination-client.tsx
│       │           └── [id]/
│       │               ├── page.tsx     # Admin destination details
│       │               ├── destination-detail-client.tsx
│       │               └── edit/
│       │                   ├── page.tsx
│       │                   └── edit-destination-client.tsx
│       ├── components/
│       │   ├── site-header.tsx
│       │   ├── hero-background.tsx
│       │   ├── destination-card.tsx
│       │   ├── destination-form.tsx
│       │   └── weather-panel.tsx
│       └── lib/
│           ├── api.ts
│           ├── destination-presentation.ts
│           └── types.ts
└── backend/
    ├── .env.example
    ├── Dockerfile
    ├── package.json
    ├── jest.config.ts
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── app.controller.ts
    │   ├── app.controller.spec.ts
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.service.spec.ts
    │   │   ├── admin-auth.guard.ts
    │   │   ├── password.util.ts
    │   │   ├── dto/
    │   │   └── schemas/
    │   ├── destinations/
    │   │   ├── destinations.controller.ts
    │   │   ├── destinations.service.ts
    │   │   ├── dto/
    │   │   └── schemas/
    │   ├── weather/
    │   │   ├── weather.service.ts
    │   │   └── weather.service.spec.ts
    └── test/
        ├── app.e2e-spec.ts
        └── jest-e2e.json
```

Developer: Abdul Azeez · Software Engineer Internship Assessment, Scripterlab
