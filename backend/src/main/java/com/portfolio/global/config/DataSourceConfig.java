package com.portfolio.global.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() throws Exception {
        String host, dbName, username, password;
        int port;

        URI uri = new URI(databaseUrl);
        String userInfo = uri.getUserInfo();

        if (userInfo != null) {
            // DATABASE_URL에 credentials 포함된 경우
            String[] parts = userInfo.split(":", 2);
            username = parts[0];
            password = parts[1];
            host = uri.getHost();
            port = uri.getPort();
            dbName = uri.getPath().replaceFirst("/", "");
        } else {
            // Railway 개별 환경변수로 fallback
            log.warn("DATABASE_URL has no userInfo, falling back to PG* env vars");
            host = System.getenv("PGHOST");
            port = Integer.parseInt(System.getenv().getOrDefault("PGPORT", "5432"));
            dbName = System.getenv("PGDATABASE");
            username = System.getenv("PGUSER");
            password = System.getenv("PGPASSWORD");
        }

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;

        if (host.endsWith(".railway.internal")) {
            log.info("Using internal network (SSL disabled)");
            jdbcUrl = jdbcUrl + "?sslmode=disable";
        } else {
            log.info("Using public network (SSL required)");
            jdbcUrl = jdbcUrl + "?sslmode=require";
        }

        log.info("DB connecting → URL: {}, user: {}", jdbcUrl, username);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setConnectionTimeout(10000);

        return new HikariDataSource(config);
    }
}
