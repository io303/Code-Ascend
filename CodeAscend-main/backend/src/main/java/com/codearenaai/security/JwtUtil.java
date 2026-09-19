package com.codearenaai.security;

import com.codearenaai.config.JwtProperties;
import com.codearenaai.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = buildSigningKey(jwtProperties.secret());
    }

    public String generateToken(User user) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + jwtProperties.accessTokenTtl().toMillis());

        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .issuedAt(issuedAt)
                .expiration(expiration)
                .subject(user.getId().toString())
                .claim("userId", user.getId().toString())
                .claim("username", user.getUsername())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .requireIssuer(jwtProperties.issuer())
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    public UserPrincipal toPrincipal(String token) {
        Claims claims = extractClaims(token);
        String role = claims.get("role", String.class);

        return new UserPrincipal(
                UUID.fromString(claims.get("userId", String.class)),
                claims.get("username", String.class),
                claims.get("email", String.class),
                role,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }

    private SecretKey buildSigningKey(String secret) {
        try {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        } catch (RuntimeException exception) {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }
}
