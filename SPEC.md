# Petstore SPEC

This file describes the Petstore backend API, its primary endpoints, the Pet model, and how to view the OpenAPI specification included in this repository (`specs/openapi.yaml`). The backend is read-only and intended for browsing pets.

## Base URL

- Local (default for development): http://localhost:8080

## Endpoints

- GET /pets
  - Description: Returns a list of pets. Optional query parameter `type` filters by pet type (e.g., `dog`, `cat`).
  - Query parameters:
    - `type` (string, optional) — filter by pet type
  - Response: 200 OK, JSON array of `Pet` objects

- GET /pets/{id}
  - Description: Returns a single pet by id.
  - Path parameters:
    - `id` (integer) — pet id
  - Responses:
    - 200 OK — JSON `Pet` object
    - 404 Not Found — pet not found

## Pet model

- id: integer (int64)
- name: string
- type: string (one of dog, cat, bird, reptile, fish)
- breed: string
- price: number (double)

Required fields: `id`, `name`, `type`.

## Examples

Get all pets:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/pets
```

Get pets filtered by type:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/pets?type=dog"
```

Get a pet by id:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/pets/1
```

## OpenAPI spec

The full machine-readable API spec is at `specs/openapi.yaml`. Use it with Swagger Editor, Swagger UI, or Redoc to explore the API interactively.

Quick view options:

- Open in Swagger Editor: https://editor.swagger.io/ and paste the contents of `specs/openapi.yaml`.
- Serve with Redoc locally (requires node or docker):

  Using npx (Redoc CLI):

  ```powershell
  npx redoc-cli serve .\specs\openapi.yaml
  ```

  Using Docker (path may need adjusting on Windows):

  ```powershell
  docker run --rm -p 8081:8080 -v ${PWD}\specs\openapi.yaml:/openapi.yaml:ro redocly/redoc:latest
  ```

## Notes

- The backend intentionally exposes read-only endpoints (no create/update/delete).
- If you want the documentation to be served by the backend itself, I can add `springdoc-openapi` and a Swagger UI configuration or copy `specs/openapi.yaml` into `petstore-backend/src/main/resources/static/` so it's available at `/openapi.yaml`.
