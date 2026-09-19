package com.codearenaai.rating.repository;

import com.codearenaai.rating.model.RatingHistory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingHistoryRepository extends JpaRepository<RatingHistory, UUID> {
    List<RatingHistory> findByUserIdOrderByCreatedAtAsc(UUID userId);
    List<RatingHistory> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<RatingHistory> findBySubmissionId(UUID submissionId);
}
