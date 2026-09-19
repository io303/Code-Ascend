package com.codearenaai.problem.repository;

import com.codearenaai.problem.model.TestCase;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestCaseRepository extends JpaRepository<TestCase, UUID> {

    List<TestCase> findAllByProblemIdOrderByDisplayOrderAsc(UUID problemId);
}
