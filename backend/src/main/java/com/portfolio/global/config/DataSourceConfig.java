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
        URI uri = new URI(databaseUrl);
        String host = uri.getHost();
        int port = uri.getPort();
        String dbName = uri.getPath().replaceFirst("/", "");
        String[] userInfo = uri.getUserInfo().split(":", 2);
        String username = userInfo[0];
        String password = userInfo[1];

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;

        if (host.endsWith(".railway.internal")) {
            // 내부 네트워크: SSL 없음
            log.info("Using internal network (SSL disabled)");
            jdbcUrl = jdbcUrl + "?sslmode=disable";
        } else {
            // 공개 URL: SSL 필요
            log.info("Using public network (SSL required)");
            jdbcUrl = jdbcUrl + "?sslmode=require";
        }

        // 디버그용 로그 (비밀번호 제외)
        log.info("DB connecting → URL: {}, user: {}", jdbcUrl, username);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setConnectionTimeout(10000);

        return new HikariDataSource(config);
    }
}
