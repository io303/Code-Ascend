package com.codearenaai;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

public abstract class AbstractEmbeddedPostgresIntegrationTest {

    protected static final String DATABASE_NAME = "codearena_ai";
    protected static final String DATABASE_USER = "codearena";
    protected static final String DATABASE_PASSWORD = "codearena";

    private static EmbeddedPostgres embeddedPostgres;

    @BeforeAll
    static void beforeAll() {
        initializeEmbeddedPostgres();
    }

    @DynamicPropertySource
    static void configureDatasource(DynamicPropertyRegistry registry) {
        initializeEmbeddedPostgres();
        registry.add("spring.datasource.url", () ->
                "jdbc:postgresql://localhost:" + embeddedPostgres.getPort() + "/" + DATABASE_NAME
        );
        registry.add("spring.datasource.username", () -> DATABASE_USER);
        registry.add("spring.datasource.password", () -> DATABASE_PASSWORD);
    }

    protected static synchronized void initializeEmbeddedPostgres() {
        if (embeddedPostgres != null) {
            return;
        }

        try {
            embeddedPostgres = EmbeddedPostgres.builder().start();

            try (Connection connection = embeddedPostgres.getPostgresDatabase().getConnection();
                 Statement statement = connection.createStatement()) {
                statement.execute("CREATE ROLE " + DATABASE_USER + " WITH LOGIN PASSWORD '" + DATABASE_PASSWORD + "'");
                statement.execute("CREATE DATABASE " + DATABASE_NAME + " OWNER " + DATABASE_USER);
            }

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                if (embeddedPostgres != null) {
                    try {
                        embeddedPostgres.close();
                    } catch (IOException ignored) {
                    }
                }
            }));
        } catch (IOException exception) {
            throw new UncheckedIOException(exception);
        } catch (SQLException exception) {
            throw new IllegalStateException("Unable to initialize embedded PostgreSQL for integration tests.", exception);
        }
    }
}
