package com.portfolio.global.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    // Railway DATABASE_URL 형식: postgresql://user:pass@host:port/dbname
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

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);

        // 공개 URL이면 SSL 필요
        if (!host.endsWith(".railway.internal")) {
            config.addDataSourceProperty("sslmode", "require");
        }

        return new HikariDataSource(config);
    }
}
