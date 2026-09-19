package com.codearenaai.problem.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Getter
@Setter
@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "slug", nullable = false, unique = true, length = 80)
    private String slug;

    @Column(name = "title", nullable = false, length = 160)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 20)
    private ProblemDifficulty difficulty;

    @Column(name = "description", nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "input_format", nullable = false, columnDefinition = "text")
    private String inputFormat;

    @Column(name = "output_format", nullable = false, columnDefinition = "text")
    private String outputFormat;

    @Column(name = "constraints", nullable = false, columnDefinition = "text")
    private String constraints;

    @Column(name = "examples_json", nullable = false, columnDefinition = "jsonb")
    private String examplesJson;

    @Column(name = "sample_input", nullable = false, columnDefinition = "text")
    private String sampleInput;

    @Column(name = "sample_output", nullable = false, columnDefinition = "text")
    private String sampleOutput;

    @Column(name = "acceptance_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal acceptanceRate;

    @Column(name = "time_limit_ms", nullable = false)
    private Integer timeLimitMs;

    @Column(name = "memory_limit_mb", nullable = false)
    private Integer memoryLimitMb;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @jakarta.persistence.ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @jakarta.persistence.CollectionTable(name = "problem_tags", joinColumns = @jakarta.persistence.JoinColumn(name = "problem_id"))
    @Column(name = "tag")
    private java.util.Set<String> tags = new java.util.HashSet<>();

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCase> testCases = new ArrayList<>();

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
