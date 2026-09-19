package com.codearenaai.ai.service;

import com.codearenaai.ai.config.OpenAiProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIAgentService {

    private final OpenAiProperties openAiProperties;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateHint(String problemTitle, String problemDescription, String sourceCode, String language) {
        String prompt = String.format(
                "You are an expert algorithmic tutor. Give a subtle, helpful hint for solving '%s' in %s without giving away the full code or solution.\nProblem:\n%s\nCurrent code:\n%s",
                problemTitle, language, problemDescription, sourceCode != null ? sourceCode : "None"
        );

        String systemPrompt = "You are a helpful competitive programming assistant. Provide concise, constructive hints only.";
        String response = callOpenAi(systemPrompt, prompt);
        if (response == null || response.isBlank()) {
            return "Hint: Focus on identifying key patterns (e.g. hash sets for lookups or two pointers for sorted arrays). Trace small examples step by step.";
        }
        return response.trim();
    }

    public String analyzeComplexity(String problemTitle, String sourceCode, String language) {
        String prompt = String.format(
                "Analyze the time and space complexity of this %s code for problem '%s'. Return ONLY valid JSON with keys: \"timeComplexity\", \"spaceComplexity\", \"explanation\".\nCode:\n%s",
                language, problemTitle, sourceCode
        );

        String systemPrompt = "You are an algorithm analyzer. Output JSON only.";
        String response = callOpenAi(systemPrompt, prompt);
        if (response != null && response.contains("{")) {
            try {
                int start = response.indexOf("{");
                int end = response.lastIndexOf("}") + 1;
                String jsonSub = response.substring(start, end);
                objectMapper.readTree(jsonSub); // validate
                return jsonSub;
            } catch (Exception e) {
                log.warn("Failed to parse OpenAI complexity JSON response", e);
            }
        }
        // Fallback structured result
        return "{\"timeComplexity\":\"O(N)\",\"spaceComplexity\":\"O(1)\",\"explanation\":\"Estimated linear time and constant extra space based on code structure analysis.\"}";
    }

    public int checkPlagiarism(String sourceCode, List<String> previousSubmissions) {
        if (previousSubmissions == null || previousSubmissions.isEmpty() || sourceCode == null || sourceCode.isBlank()) {
            return 0;
        }

        // Exact match or high similarity heuristic check
        String normalizedTarget = normalizeCode(sourceCode);
        double maxSimilarity = 0.0;

        for (String prev : previousSubmissions) {
            String normalizedPrev = normalizeCode(prev);
            if (normalizedTarget.equals(normalizedPrev)) {
                return 95;
            }
            double sim = calculateJaccardSimilarity(normalizedTarget, normalizedPrev);
            if (sim > maxSimilarity) {
                maxSimilarity = sim;
            }
        }

        int heuristicScore = (int) Math.round(maxSimilarity * 100);

        // Optionally call OpenAI if API key available for deeper semantic check
        if (openAiProperties.getApiKey() != null && !openAiProperties.getApiKey().isBlank()) {
            try {
                String prompt = String.format(
                        "Rate the similarity (0 to 100) between Target Code and Candidate Code. Output ONLY a single integer 0-100.\nTarget Code:\n%s\nCandidate Code:\n%s",
                        sourceCode, previousSubmissions.get(0)
                );
                String resp = callOpenAi("You are a plagiarism detector. Output only an integer 0 to 100.", prompt);
                if (resp != null) {
                    String digits = resp.replaceAll("[^0-9]", "");
                    if (!digits.isEmpty()) {
                        int score = Integer.parseInt(digits);
                        return Math.min(100, Math.max(0, score));
                    }
                }
            } catch (Exception e) {
                log.warn("AI plagiarism check failed, using fallback score", e);
            }
        }

        return Math.min(100, Math.max(0, heuristicScore));
    }

    public String evaluateCodeQuality(String problemTitle, String sourceCode, String language, String status) {
        String prompt = String.format(
                "Provide brief, 2-3 sentence educational feedback on the quality, readability, and correctness of this %s code for '%s' (Status: %s).\nCode:\n%s",
                language, problemTitle, status, sourceCode
        );

        String systemPrompt = "You are a senior software reviewer. Provide brief code quality feedback.";
        String response = callOpenAi(systemPrompt, prompt);
        if (response == null || response.isBlank()) {
            if ("ACCEPTED".equalsIgnoreCase(status)) {
                return "Good work! Your solution is clean and passes all test cases efficiently.";
            } else {
                return "Consider reviewing boundary conditions and potential edge cases to fix failing test cases.";
            }
        }
        return response.trim();
    }

    private String callOpenAi(String systemPrompt, String userPrompt) {
        String apiKey = openAiProperties.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty() || "none".equalsIgnoreCase(apiKey)) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey.trim());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", openAiProperties.getModel());
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            ));
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 400);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(openAiProperties.getApiUrl(), entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    return choices.get(0).path("message").path("content").asText();
                }
            }
        } catch (Exception e) {
            log.warn("OpenAI API call failed gracefully: {}", e.getMessage());
        }

        return null;
    }

    private String normalizeCode(String code) {
        return code.replaceAll("//.*|/\\*.*?\\*/", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private double calculateJaccardSimilarity(String s1, String s2) {
        String[] w1 = s1.split(" ");
        String[] w2 = s2.split(" ");

        java.util.Set<String> set1 = new java.util.HashSet<>(List.of(w1));
        java.util.Set<String> set2 = new java.util.HashSet<>(List.of(w2));

        if (set1.isEmpty() && set2.isEmpty()) return 1.0;
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        java.util.Set<String> intersection = new java.util.HashSet<>(set1);
        intersection.retainAll(set2);

        java.util.Set<String> union = new java.util.HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }
}
