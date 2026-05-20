# API Specs

This folder contains the OpenAPI specification for the Petstore backend.

Files

- `openapi.yaml` - OpenAPI 3.0 spec describing the read-only endpoints exposed by the Spring Boot backend.

How to use

- Serve with Swagger UI or Redoc. For example, using Docker:

  docker run --rm -p 8081:8080 -v $(pwd)/openapi.yaml:/openapi.yaml:ro redocly/redoc:latest

  Then open http://localhost:8081 in your browser.

Or open the `openapi.yaml` in the Swagger Editor: https://editor.swagger.io/ and paste the contents.
