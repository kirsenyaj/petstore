# Petstore

Full-stack demo app for browsing pets. This is a browsing-only storefront (no checkout or write operations). Stack: Java Spring Boot, Postgres, Docker, React, Tailwind, MUI. Intended to deploy on Render free-tier.

Local development

- Start Postgres + backend + frontend:

  docker compose up --build

Backend

- Spring Boot app in `petstore-backend` (port 8080). The backend exposes read-only endpoints for listing and retrieving pets.

Frontend

- Vite React app in `petstore-frontend` (port 3000)

Render deployment

- Use two services: a Postgres managed DB (free-tier), a Web Service for backend (Docker) and a Static Site for frontend.
