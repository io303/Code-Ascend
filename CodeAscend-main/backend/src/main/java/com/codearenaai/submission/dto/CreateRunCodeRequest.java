package com.codearenaai.submission.dto;

import com.codearenaai.submission.model.SubmissionLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRunCodeRequest {
    @NotNull(message = "Language is required")
    private SubmissionLanguage language;

    @NotBlank(message = "Source code is required")
    private String sourceCode;

    private String customInput;

    private String problemSlug;
}
