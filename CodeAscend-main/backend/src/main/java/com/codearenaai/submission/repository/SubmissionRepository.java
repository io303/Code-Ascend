package com.codearenaai.submission.repository;

import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubmissionRepository extends JpaRepository<Submission, UUID>, JpaSpecificationExecutor<Submission> {

    List<Submission> findAllByUserIdOrderBySubmittedAtDesc(UUID userId);

    Page<Submission> findByUserIdOrderBySubmittedAtDesc(UUID userId, Pageable pageable);

    List<Submission> findAllByProblemIdOrderBySubmittedAtDesc(UUID problemId);

    List<Submission> findByUserIdAndProblemSlugOrderBySubmittedAtDesc(UUID userId, String problemSlug);

    Optional<Submission> findByEvaluationId(UUID evaluationId);

    @Query("SELECT s FROM Submission s JOIN FETCH s.problem p LEFT JOIN FETCH p.testCases LEFT JOIN FETCH s.user WHERE s.id = :id")
    Optional<Submission> findByIdWithDetails(@Param("id") UUID id);

    List<Submission> findByStatusInAndSubmittedAtBefore(Collection<SubmissionStatus> statuses, Instant cutoff);

    long countByUserId(UUID userId);

    long countByUserIdAndStatus(UUID userId, SubmissionStatus status);

    long countByUserIdAndProblemId(UUID userId, UUID problemId);

    long countByUserIdAndProblemIdAndStatus(UUID userId, UUID problemId, SubmissionStatus status);

    long countByStatus(SubmissionStatus status);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    long countDistinctSolvedProblemsByUserId(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    List<UUID> findSolvedProblemIdsByUserId(@Param("userId") UUID userId);

    List<Submission> findByProblemIdAndStatus(UUID problemId, SubmissionStatus status);
}
