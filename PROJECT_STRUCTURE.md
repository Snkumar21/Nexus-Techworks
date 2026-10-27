# Nexus Techworks — Project Structure

```text
Nexus Techworks/
├── nexus-techworks/          # Single React/Vite frontend
│   └── src/
│       ├── admin/            # Admin UI lives here
│       ├── assets/
│       ├── components/       # Shared/public components
│       ├── context/
│       ├── layouts/
│       ├── pages/            # Public website pages
│       ├── routes/
│       ├── services/
│       └── styles/
├── backend/                  # Express API (separate deployable service)
├── README.md
└── PROJECT_STRUCTURE.md
```

## Routing
- Public website: `/`, `/about`, `/services`, `/projects`, `/career`, `/founder`, `/contact`, `/clients`
- Admin workspace: `/admin/*`

## Notes
- The redundant standalone `admin-panel/` Vite application was removed.
- The admin files in the supplied ZIP were empty placeholders; they were not functional code. Empty placeholders were removed and a clean integrated admin entry point was added.
- Backend remains separate because it is an API/server application, not browser frontend code.
