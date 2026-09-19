package com.codearenaai.problem.repository;

import com.codearenaai.problem.model.ProblemBookmark;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemBookmarkRepository extends JpaRepository<ProblemBookmark, UUID> {

    Optional<ProblemBookmark> findByUserIdAndProblemId(UUID userId, UUID problemId);

    boolean existsByUserIdAndProblemId(UUID userId, UUID problemId);

    List<ProblemBookmark> findByUserIdOrderByCreatedAtDesc(UUID userId);

    void deleteByUserIdAndProblemId(UUID userId, UUID problemId);
}
