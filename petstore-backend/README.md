Spring Boot backend (read-only browsing API). Build with Maven.

- Build jar: mvn -f pom.xml clean package
- Run: java -jar target/petstore-backend-0.0.1-SNAPSHOT.jar

This backend only exposes GET endpoints for listing pets and retrieving a single pet. Create/delete endpoints are intentionally omitted to keep the service browsing-only.
