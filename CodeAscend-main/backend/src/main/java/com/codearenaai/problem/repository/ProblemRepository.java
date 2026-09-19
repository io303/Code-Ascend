package com.codearenaai.problem.repository;

import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.ProblemDifficulty;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProblemRepository extends JpaRepository<Problem, UUID>, JpaSpecificationExecutor<Problem> {

    Optional<Problem> findBySlug(String slug);

    List<Problem> findAllByDifficultyOrderByTitleAsc(ProblemDifficulty difficulty);

    @Query("SELECT DISTINCT t FROM Problem p JOIN p.tags t ORDER BY t ASC")
    List<String> findAllDistinctTags();
}
