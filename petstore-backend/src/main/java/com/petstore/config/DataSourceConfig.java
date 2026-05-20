package com.petstore.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(Environment env) throws Exception {
        // Prefer Spring property if provided
        String springUrl = env.getProperty("spring.datasource.url");
        if (springUrl != null && !springUrl.isBlank()) {
            // Normalize URLs that may be provided without the jdbc: prefix
            String effectiveUrl = springUrl.trim();
            if (!effectiveUrl.startsWith("jdbc:") && effectiveUrl.startsWith("postgresql://")) {
                effectiveUrl = "jdbc:" + effectiveUrl;
            }

            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl(effectiveUrl);
            // ensure driver is set explicitly to help the pool locate the driver
            cfg.setDriverClassName("org.postgresql.Driver");

            String user = env.getProperty("spring.datasource.username");
            String pass = env.getProperty("spring.datasource.password");
            if (user != null) cfg.setUsername(user);
            if (pass != null) cfg.setPassword(pass);
            return new HikariDataSource(cfg);
        }

        // Render and many cloud providers expose DATABASE_URL in the form: postgres://user:pass@host:port/db
        String databaseUrl = env.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            // Let Spring Boot auto-configure the DataSource if no env var is present
            return null;
        }

        // If it already starts with jdbc:, use it as-is
        if (databaseUrl.startsWith("jdbc:")) {
            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl(databaseUrl);
            return new HikariDataSource(cfg);
        }

        // Parse DATABASE_URL robustly. Expect formats like:
        //  - postgres://user:pass@host:port/dbname
        //  - postgresql://user:pass@host/dbname
        // Remove scheme
        String withoutScheme = databaseUrl.replaceFirst("^[^:]+://", "");
        String username = null;
        String password = null;
        String hostPortAndPath = withoutScheme;

        // Split userinfo if present
        if (withoutScheme.contains("@")) {
            String[] splitAtAt = withoutScheme.split("@", 2);
            String userInfo = splitAtAt[0];
            hostPortAndPath = splitAtAt[1];
            String[] parts = userInfo.split(":", 2);
            username = parts[0];
            if (parts.length > 1) password = parts[1];
        }

        // Split host/port from path
        String hostPort;
        String path = "";
        int slashIdx = hostPortAndPath.indexOf('/');
        if (slashIdx >= 0) {
            hostPort = hostPortAndPath.substring(0, slashIdx);
            path = hostPortAndPath.substring(slashIdx); // includes leading '/'
        } else {
            hostPort = hostPortAndPath;
        }

        String host;
        int port = -1;
        if (hostPort.contains(":")) {
            String[] hp = hostPort.split(":", 2);
            host = hp[0];
            try {
                port = Integer.parseInt(hp[1]);
            } catch (NumberFormatException ex) {
                // ignore and treat as no port
                port = -1;
            }
        } else {
            host = hostPort;
        }

        if (host == null || host.isBlank()) {
            throw new IllegalArgumentException("Invalid DATABASE_URL, missing host: " + databaseUrl);
        }

        String jdbcUrl = "jdbc:postgresql://" + host + (port == -1 ? ":5432" : ":" + port) + (path != null ? path : "");

        // If PGSSLMODE is set (e.g. require), append it to the JDBC URL
        String pgSslMode = env.getProperty("PGSSLMODE");
        if (pgSslMode != null && !pgSslMode.isBlank()) {
            if (!jdbcUrl.contains("?")) jdbcUrl = jdbcUrl + "?sslmode=" + pgSslMode;
            else jdbcUrl = jdbcUrl + "&sslmode=" + pgSslMode;
        }

        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(jdbcUrl);
        cfg.setDriverClassName("org.postgresql.Driver");
        if (username != null) cfg.setUsername(username);
        if (password != null) cfg.setPassword(password);
        // sensible defaults
        cfg.setMaximumPoolSize(10);
        cfg.setPoolName("HikariPool-Render");

        return new HikariDataSource(cfg);
    }
}
