package com.portfolio.global.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    // postgres(ql)://user:pass@host:port/db  또는  postgres(ql)://host:port/db
    private static final Pattern DB_URL_PATTERN = Pattern.compile(
            "(?:postgres(?:ql)?://)(?:([^:@]+):([^@]*)@)?([^/:]+)(?::(\\d+))?/(.+)"
    );

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        String host, dbName, username, password;
        int port = 5432;

        Matcher m = DB_URL_PATTERN.matcher(databaseUrl.trim());
        // 디버그: 어떤 DB 관련 환경변수가 존재하는지 이름만 출력
        System.getenv().forEach((k, v) -> {
            if (k.contains("PG") || k.contains("DATABASE") || k.contains("POSTGRES") || k.contains("DB")) {
                log.info("ENV: {}={}", k, k.toLowerCase().contains("pass") || k.toLowerCase().contains("secret") ? "***" : v);
            }
        });

        if (m.matches() && m.group(1) != null) {
            // DATABASE_URL에 credentials 포함
            username = m.group(1);
            password = m.group(2);
            host = m.group(3);
            port = m.group(4) != null ? Integer.parseInt(m.group(4)) : 5432;
            dbName = m.group(5);
            log.info("Parsed credentials from DATABASE_URL");
        } else {
            // PG* 개별 환경변수 fallback
            log.warn("DATABASE_URL has no credentials, falling back to PG* env vars");
            host = getEnv("PGHOST");
            String pgPort = getEnv("PGPORT");
            port = (pgPort != null && !pgPort.isEmpty()) ? Integer.parseInt(pgPort) : 5432;
            dbName = getEnv("PGDATABASE");
            username = getEnv("PGUSER");
            password = getEnv("PGPASSWORD");
        }

        if (host == null) {
            throw new IllegalStateException("DB host를 확인할 수 없습니다. DATABASE_URL 또는 PGHOST 환경변수를 확인하세요.");
        }

        String sslMode = host.endsWith(".railway.internal") ? "disable" : "require";
        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName + "?sslmode=" + sslMode;

        log.info("DB connecting → {}, user: {}", jdbcUrl, username);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setConnectionTimeout(10000);

        return new HikariDataSource(config);
    }

    private String getEnv(String key) {
        String val = System.getenv(key);
        return (val != null && !val.isEmpty()) ? val : null;
    }
}
