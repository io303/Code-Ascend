package com.codearenaai.ai.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "application.ai.openai")
public class OpenAiProperties {
    private String apiKey = System.getenv("OPENAI_API_KEY");
    private String model = "gpt-4o-mini";
    private String apiUrl = "https://api.openai.com/v1/chat/completions";
}
