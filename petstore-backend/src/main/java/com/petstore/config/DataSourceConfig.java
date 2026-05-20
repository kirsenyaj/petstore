package com.petstore.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(Environment env) throws Exception {
        // Prefer Spring property if provided
        String springUrl = env.getProperty("spring.datasource.url");
        if (springUrl != null && !springUrl.isBlank()) {
            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl(springUrl);
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

        // Parse URL like: postgres://user:pass@host:port/dbname
        URI uri = new URI(databaseUrl);
        String userInfo = uri.getUserInfo();
        String username = null;
        String password = null;
        if (userInfo != null) {
            String[] parts = userInfo.split(":", 2);
            username = parts[0];
            if (parts.length > 1) password = parts[1];
        }

        String host = uri.getHost();
        int port = uri.getPort();
        String path = uri.getPath(); // includes leading '/'

        String jdbcUrl = String.format("jdbc:postgresql://%s:%d%s", host, port == -1 ? 5432 : port, path != null ? path : "");

        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(jdbcUrl);
        if (username != null) cfg.setUsername(username);
        if (password != null) cfg.setPassword(password);
        // sensible defaults
        cfg.setMaximumPoolSize(10);
        cfg.setPoolName("HikariPool-Render");

        return new HikariDataSource(cfg);
    }
}
