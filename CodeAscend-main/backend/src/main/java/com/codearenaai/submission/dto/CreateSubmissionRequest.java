package com.codearenaai.submission.dto;

import com.codearenaai.submission.model.SubmissionLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubmissionRequest {
    private UUID problemId;
    private String problemSlug;
    @NotNull(message = "Language is required")
    private SubmissionLanguage language;
    @NotBlank(message = "Source code cannot be blank")
    private String sourceCode;
}
