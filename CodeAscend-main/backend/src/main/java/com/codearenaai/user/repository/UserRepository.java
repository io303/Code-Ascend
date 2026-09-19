package com.codearenaai.user.repository;

import com.codearenaai.user.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Page<User> findAllByOrderByRatingDescUsernameAsc(Pageable pageable);

    List<User> findAllByOrderByRatingDesc();

    long countByRatingGreaterThan(int rating);

    @Query("SELECT AVG(u.rating) FROM User u")
    Double findAverageRating();
}
