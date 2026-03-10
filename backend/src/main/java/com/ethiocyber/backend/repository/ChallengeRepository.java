package com.ethiocyber.backend.repository;

import com.ethiocyber.backend.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    Optional<Challenge> findByChallengeKey(String challengeKey);
    boolean existsByChallengeKey(String challengeKey);
}
