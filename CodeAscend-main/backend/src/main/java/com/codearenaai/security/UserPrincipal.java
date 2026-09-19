package com.codearenaai.security;

import java.util.Collection;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;

public record UserPrincipal(
        UUID userId,
        String username,
        String email,
        String role,
        Collection<? extends GrantedAuthority> authorities
) {
    public UUID getId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }
}
