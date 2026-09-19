package com.codearenaai.submission;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.auth.dto.RegisterRequest;
import com.codearenaai.submission.dto.CreateSubmissionRequest;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.service.EvaluationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.junit.jupiter.api.Assertions;
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
class SubmissionsIntegrationTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EvaluationService evaluationService;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "sub_user_" + System.currentTimeMillis(),
                "sub_" + System.currentTimeMillis() + "@codearena.ai",
                "Submission Test User",
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
    void createSubmission_WhenAuthenticated_ShouldCreateSubmission() throws Exception {
        CreateSubmissionRequest req = CreateSubmissionRequest.builder()
                .problemSlug("two-sum-sorted")
                .language(SubmissionLanguage.PYTHON)
                .sourceCode("import sys\nprint('2 4')")
                .build();

        mockMvc.perform(post("/submissions")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", not(nullValue())))
                .andExpect(jsonPath("$.problemSlug", is("two-sum-sorted")));
    }

    @Test
    void submission_ShouldTransitionFromPendingToTerminalStatus() throws Exception {
        CreateSubmissionRequest req = CreateSubmissionRequest.builder()
                .problemSlug("two-sum-sorted")
                .language(SubmissionLanguage.PYTHON)
                .sourceCode("import sys\nprint('2 4')")
                .build();

        MvcResult result = mockMvc.perform(post("/submissions")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        UUID submissionId = UUID.fromString(json.get("id").asText());

        // Explicitly trigger evaluation to ensure transition completes
        evaluationService.evaluateSubmission(submissionId);

        MvcResult fetchResult = mockMvc.perform(get("/submissions/" + submissionId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", not(is("PENDING"))))
                .andReturn();

        String status = objectMapper.readTree(fetchResult.getResponse().getContentAsString()).get("status").asText();
        Assertions.assertTrue("ACCEPTED".equals(status) || "WRONG_ANSWER".equals(status) || "RUNTIME_ERROR".equals(status) || "TIME_LIMIT_EXCEEDED".equals(status));
    }

    @Test
    void getMySubmissions_WhenAuthenticated_ShouldReturnSubmissions() throws Exception {
        mockMvc.perform(get("/submissions/my")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is(not(nullValue()))));
    }

    @Test
    void createSubmission_WhenUnauthenticated_ShouldReturn401() throws Exception {
        CreateSubmissionRequest req = CreateSubmissionRequest.builder()
                .problemSlug("two-sum-sorted")
                .language(SubmissionLanguage.PYTHON)
                .sourceCode("print('test')")
                .build();

        mockMvc.perform(post("/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }
}
