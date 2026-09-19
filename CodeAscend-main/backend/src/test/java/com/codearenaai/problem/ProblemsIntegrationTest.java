package com.codearenaai.problem;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProblemsIntegrationTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getProblems_ShouldReturnPagedProblemsList() throws Exception {
        mockMvc.perform(get("/problems")
                        .param("page", "0")
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(lessThanOrEqualTo(5))))
                .andExpect(jsonPath("$.page", is(0)))
                .andExpect(jsonPath("$.totalElements", greaterThan(0)));
    }

    @Test
    void getProblems_WithDifficultyFilter_ShouldReturnFilteredProblems() throws Exception {
        mockMvc.perform(get("/problems")
                        .param("difficulty", "EASY")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].difficulty", everyItem(is("EASY"))));
    }

    @Test
    void getProblems_WithSearchQuery_ShouldReturnMatchingProblems() throws Exception {
        mockMvc.perform(get("/problems")
                        .param("search", "Two Sum")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title", containsStringIgnoringCase("Two Sum")));
    }

    @Test
    void getProblemTags_ShouldReturnTagsList() throws Exception {
        mockMvc.perform(get("/problems/tags")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))));
    }

    @Test
    void getProblemBySlug_ShouldReturnProblemDetail_AndNeverExposeHiddenTestCases() throws Exception {
        mockMvc.perform(get("/problems/two-sum-sorted")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug", is("two-sum-sorted")))
                .andExpect(jsonPath("$.visibleTestCases", is(not(nullValue()))));
    }

    @Test
    void getProblemBySlug_WhenNotFound_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/problems/non-existent-slug-xyz")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
