package com.codearenaai;

import com.codearenaai.auth.dto.LoginRequest;
import com.codearenaai.auth.dto.RegisterRequest;
import com.codearenaai.security.JwtUtil;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import java.time.Duration;
import java.time.Instant;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void registrationCreatesUserAndReturnsToken() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "auth_register_user",
                "register@codearena.ai",
                "Register User",
                "SecurePass123!"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isString())
                .andExpect(jsonPath("$.user.username").value("auth_register_user"))
                .andExpect(jsonPath("$.user.email").value("register@codearena.ai"))
                .andExpect(jsonPath("$.user.role").value("USER"));

        User persistedUser = userRepository.findByEmail("register@codearena.ai").orElseThrow();
        Assertions.assertEquals("auth_register_user", persistedUser.getUsername());
        Assertions.assertEquals("USER", persistedUser.getRole().name());
        Assertions.assertNotEquals("SecurePass123!", persistedUser.getPasswordHash());
        Assertions.assertTrue(passwordEncoder.matches("SecurePass123!", persistedUser.getPasswordHash()));
    }

    @Test
    void loginReturnsJwtForValidCredentials() throws Exception {
        RegisterRequest registration = new RegisterRequest(
                "auth_login_user",
                "login@codearena.ai",
                "Login User",
                "SecurePass123!"
        );
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registration)));

        LoginRequest loginRequest = new LoginRequest("login@codearena.ai", "SecurePass123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isString())
                .andExpect(jsonPath("$.user.username").value("auth_login_user"))
                .andExpect(jsonPath("$.user.email").value("login@codearena.ai"));
    }

    @Test
    void issuedJwtContainsExpectedClaimsAndTwentyFourHourExpiration() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "auth_claims_user",
                "claims@codearena.ai",
                "Claims User",
                "SecurePass123!"
        );

        MvcResult registrationResult = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode responseBody = objectMapper.readTree(registrationResult.getResponse().getContentAsString());
        String token = responseBody.get("accessToken").asText();

        Claims claims = jwtUtil.extractClaims(token);
        Instant issuedAt = claims.getIssuedAt().toInstant();
        Instant expiration = claims.getExpiration().toInstant();

        Assertions.assertEquals("claims@codearena.ai", claims.get("email", String.class));
        Assertions.assertEquals("auth_claims_user", claims.get("username", String.class));
        Assertions.assertEquals("USER", claims.get("role", String.class));
        Assertions.assertEquals(claims.getSubject(), claims.get("userId", String.class));
        Assertions.assertEquals(Duration.ofHours(24), Duration.between(issuedAt, expiration));
    }

    @Test
    void jwtAllowsAccessToAuthenticatedMeEndpoint() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "auth_me_user",
                "me@codearena.ai",
                "Me User",
                "SecurePass123!"
        );

        MvcResult registrationResult = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode responseBody = objectMapper.readTree(registrationResult.getResponse().getContentAsString());
        String token = responseBody.get("accessToken").asText();

        mockMvc.perform(get("/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("auth_me_user"))
                .andExpect(jsonPath("$.user.email").value("me@codearena.ai"))
                .andExpect(jsonPath("$.user.role").value("USER"));
    }

    @Test
    void protectedEndpointRejectsAnonymousRequests() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointRejectsInvalidJwt() throws Exception {
        mockMvc.perform(get("/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.jwt.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void seededPasswordHashRemainsBcryptCompatible() {
        String seededHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

        Assertions.assertTrue(seededHash.startsWith("$2a$10$"));
        Assertions.assertTrue(seededHash.length() >= 60);
    }
}
