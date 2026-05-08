Render deployment notes:

- Create a Postgres managed DB on Render.
- Create a Web Service for the backend. Use Dockerfile in `petstore-backend` and set env vars to connect to Render Postgres.
- Create a Static Site for the frontend (or Web Service). If Static Site, build command `npm ci && npm run build` and publish `dist`.
