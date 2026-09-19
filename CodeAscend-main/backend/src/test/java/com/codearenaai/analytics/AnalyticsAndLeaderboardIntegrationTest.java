package com.codearenaai.analytics;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.auth.dto.RegisterRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class AnalyticsAndLeaderboardIntegrationTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "analytics_user_" + System.currentTimeMillis(),
                "analytics_" + System.currentTimeMillis() + "@codearena.ai",
                "Analytics Test User",
                "SecurePass123!"
        );

        MvcResult result = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode responseBody = objectMapper.readTree(result.getResponse().getContentAsString());
        jwtToken = responseBody.get("accessToken").asText();
    }

    @Test
    void getLeaderboard_WhenAuthenticated_ShouldReturnLeaderboard() throws Exception {
        mockMvc.perform(get("/leaderboard")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is(not(nullValue()))));
    }

    @Test
    void getMyRank_WhenAuthenticated_ShouldReturnUserRank() throws Exception {
        mockMvc.perform(get("/leaderboard/me")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rank", greaterThan(0)))
                .andExpect(jsonPath("$.rating", is(not(nullValue()))));
    }

    @Test
    void getDashboard_WhenAuthenticated_ShouldReturnDashboardStats() throws Exception {
        mockMvc.perform(get("/dashboard")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentRating", is(not(nullValue()))))
                .andExpect(jsonPath("$.difficultyBreakdown", is(not(nullValue()))));
    }

    @Test
    void getPlatformAnalytics_WhenAuthenticated_ShouldReturnAnalytics() throws Exception {
        mockMvc.perform(get("/analytics/dashboard")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers", greaterThan(0)))
                .andExpect(jsonPath("$.totalProblems", greaterThan(0)));
    }
}
