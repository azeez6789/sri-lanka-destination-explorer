# Sri Lanka Destination Explorer — Frontend

The Next.js website for discovering Sri Lankan destinations, reading place
details, checking local weather, and managing destination records as an admin.

## Main pages

| URL | Page file | Content |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page with the Sri Lanka hero, experiences, destination cards and trip ideas. |
| `/destinations/:id` | `src/app/destinations/[id]/page.tsx` | Destination overview, location and weather. |
| `/admin/login` | `src/app/admin/login/page.tsx` | Admin sign-in. |
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard for managing destinations. |
| `/admin/destinations/new` | `src/app/admin/destinations/new/` | Add a destination. |
| `/admin/destinations/:id` | `src/app/admin/destinations/[id]/` | View a saved destination in the admin area. |
| `/admin/destinations/:id/edit` | `src/app/admin/destinations/[id]/edit/` | Edit a destination. |

## Source file guide

| File or folder | Content |
|---|---|
| `src/app/layout.tsx` | Root layout and site metadata. |
| `src/app/globals.css` | Shared visual theme and responsive layout rules. |
| `src/components/site-header.tsx` | Main navigation and Sri Lanka Explorer brand. |
| `src/components/destination-card.tsx` | Reusable destination preview card. |
| `src/components/hero-background.tsx` | Home-page hero image and visual effects. |
| `src/components/weather-panel.tsx` | Current weather for a destination. |
| `src/components/destination-form.tsx` | Admin destination create/edit form. |
| `src/lib/api.ts` | Backend API URL and request helpers. |
| `src/lib/destination-presentation.ts` | Destination image and location display helpers. |
| `src/lib/types.ts` | Shared frontend data types. |
| `public/` | Hero and destination photography. |

## Run locally

From the repository root, copy the frontend environment example and install
dependencies:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the backend API URL ending
in `/api`. The frontend runs at `http://localhost:3000`.

## Validate

```powershell
npm run lint
npm run build
```

See the root [README](../README.md) for backend setup, API details and deployment
instructions.
