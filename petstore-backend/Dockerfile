# Multi-stage Dockerfile: build the JAR with Maven then run it on a lightweight JRE image.
# Stage 1: build with Maven
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace
# copy only what is needed first for better cache utilization
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY src ./src
RUN mvn -B package -DskipTests

# Stage 2: runtime image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# copy the built jar from the build stage
COPY --from=build /workspace/target/petstore-backend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
