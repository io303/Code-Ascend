package com.codearenaai;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
class PersistenceStartupIntegrationTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @Test
    void startupAppliesFlywayAndSeedsData() throws SQLException {
        Integer migrationCount = jdbcTemplate.queryForObject(
                "select count(*) from flyway_schema_history where success = true",
                Integer.class
        );
        Integer userCount = jdbcTemplate.queryForObject("select count(*) from users", Integer.class);
        Integer problemCount = jdbcTemplate.queryForObject("select count(*) from problems", Integer.class);
        Integer testCaseCount = jdbcTemplate.queryForObject("select count(*) from test_cases", Integer.class);
        Integer submissionSchemaColumns = jdbcTemplate.queryForObject(
                """
                select count(*)
                from information_schema.columns
                where table_name = 'submissions'
                  and column_name in ('evaluation_id', 'queue_key', 'queued_at', 'started_at', 'completed_at', 'failure_message')
                """,
                Integer.class
        );

        Assertions.assertTrue(migrationCount >= 5, "Expected at least 5 flyway migrations applied");
        Assertions.assertTrue(userCount >= 10, "Expected at least 10 seeded users");
        Assertions.assertEquals(15, problemCount);
        Assertions.assertEquals(60, testCaseCount);
        Assertions.assertEquals(6, submissionSchemaColumns);

        try (Connection connection = dataSource.getConnection()) {
            Assertions.assertFalse(connection.isClosed());
        }
    }
}
