# Vue.js + FastAPI Web Application

Full-stack web application with Vue.js frontend, FastAPI backend, PostgreSQL database, and Keycloak authentication.

## Technology Stack

- **Frontend**: Vue.js 3 with DaisyUI/Tailwind CSS
- **Backend**: FastAPI with Python 3.12
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: Keycloak (OAuth2/OIDC)

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

## Database Migrations

Uses Alembic for database migrations. Migrations run automatically on startup.

## License

Apache License 2.0 - See [LICENSE](LICENSE)

## Copyright

Copyright 2025 Alejandro Martinez Corria
