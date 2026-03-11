package com.ethiocyber.backend.service;

import com.ethiocyber.backend.dto.ChallengeCreateRequest;
import com.ethiocyber.backend.dto.ChallengeDto;
import com.ethiocyber.backend.entity.AppUser;
import com.ethiocyber.backend.entity.Badge;
import com.ethiocyber.backend.entity.Challenge;
import com.ethiocyber.backend.entity.UserProgress;
import com.ethiocyber.backend.repository.AppUserRepository;
import com.ethiocyber.backend.repository.BadgeRepository;
import com.ethiocyber.backend.repository.ChallengeRepository;
import com.ethiocyber.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final AppUserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final UserProgressRepository userProgressRepository;

    // Badge definitions
    private static final Map<String, BadgeInfo> BADGE_DEFINITIONS = Map.ofEntries(
            Map.entry("first-challenge", new BadgeInfo("First Steps", "Complete your first challenge", "\uD83D\uDEE1\uFE0F")),
            Map.entry("five-challenges", new BadgeInfo("Rising Star", "Complete 5 challenges", "\u2B50")),
            Map.entry("ten-challenges", new BadgeInfo("Cyber Warrior", "Complete 10 challenges", "\u2694\uFE0F")),
            Map.entry("all-easy", new BadgeInfo("Fundamentals Master", "Complete all Easy challenges", "\uD83D\uDCDA")),
            Map.entry("all-medium", new BadgeInfo("Skilled Operator", "Complete all Medium challenges", "\uD83C\uDFAF")),
            Map.entry("all-hard", new BadgeInfo("Elite Hacker", "Complete all Hard challenges", "\uD83D\uDC80")),
            Map.entry("web-security-master", new BadgeInfo("Web Guardian", "Complete all Web Security challenges", "\uD83C\uDF10")),
            Map.entry("crypto-master", new BadgeInfo("Cipher Breaker", "Complete all Cryptography challenges", "\uD83D\uDD10")),
            Map.entry("network-master", new BadgeInfo("Network Sentinel", "Complete all Networking challenges", "\uD83D\uDCE1")),
            Map.entry("points-500", new BadgeInfo("Point Collector", "Earn 500 or more points", "\uD83D\uDC8E")),
            Map.entry("points-1000", new BadgeInfo("Cyber Legend", "Earn 1000 or more points", "\uD83C\uDFC6")),
            Map.entry("top-10", new BadgeInfo("Top 10 Talent", "Reach the top 10 on the leaderboard", "\uD83D\uDD25"))
    );

    public List<ChallengeDto> getAllChallenges() {
        return challengeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ChallengeDto getChallengeByKey(String key) {
        Challenge challenge = challengeRepository.findByChallengeKey(key)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));
        return toDto(challenge);
    }

    public ChallengeDto createChallenge(ChallengeCreateRequest request) {
        String key = "challenge-" + System.currentTimeMillis();
        Challenge challenge = Challenge.builder()
                .challengeKey(key)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .points(request.getPoints())
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .hints(request.getHints() != null ? request.getHints() : new ArrayList<>())
                .build();

        challengeRepository.save(challenge);
        return toDto(challenge);
    }

    public ChallengeDto updateChallenge(String key, ChallengeCreateRequest request) {
        Challenge challenge = challengeRepository.findByChallengeKey(key)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        challenge.setTitle(request.getTitle());
        challenge.setDescription(request.getDescription());
        challenge.setCategory(request.getCategory());
        challenge.setDifficulty(request.getDifficulty());
        challenge.setPoints(request.getPoints());
        challenge.setQuestion(request.getQuestion());
        challenge.setAnswer(request.getAnswer());
        if (request.getHints() != null) {
            challenge.setHints(request.getHints());
        }

        challengeRepository.save(challenge);
        return toDto(challenge);
    }

    public void deleteChallenge(String key) {
        Challenge challenge = challengeRepository.findByChallengeKey(key)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));
        challengeRepository.delete(challenge);
    }

    @Transactional
    public boolean submitAnswer(String username, String challengeKey, String answer) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Challenge challenge = challengeRepository.findByChallengeKey(challengeKey)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // Already completed?
        if (user.getCompletedChallenges().contains(challengeKey)) {
            return false;
        }

        // Check answer
        if (!answer.trim().equalsIgnoreCase(challenge.getAnswer().trim())) {
            return false;
        }

        // Award points
        user.setPoints(user.getPoints() + challenge.getPoints());
        user.getCompletedChallenges().add(challengeKey);
        userRepository.save(user);

        // Record progress
        UserProgress progress = UserProgress.builder()
                .userId(user.getId())
                .challengeId(challengeKey)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .pointsEarned(challenge.getPoints())
                .build();
        userProgressRepository.save(progress);

        // Check and award badges
        awardBadges(user);

        return true;
    }

    private void awardBadges(AppUser user) {
        List<Challenge> allChallenges = challengeRepository.findAll();
        int completedCount = user.getCompletedChallenges().size();

        // Completion count badges
        checkAndAward(user, "first-challenge", completedCount >= 1);
        checkAndAward(user, "five-challenges", completedCount >= 5);
        checkAndAward(user, "ten-challenges", completedCount >= 10);

        // Difficulty badges
        checkAndAward(user, "all-easy", allOfDifficulty(user, allChallenges, "Easy"));
        checkAndAward(user, "all-medium", allOfDifficulty(user, allChallenges, "Medium"));
        checkAndAward(user, "all-hard", allOfDifficulty(user, allChallenges, "Hard"));

        // Category badges
        checkAndAward(user, "web-security-master", allOfCategory(user, allChallenges, "Web Security"));
        checkAndAward(user, "crypto-master", allOfCategory(user, allChallenges, "Cryptography"));
        checkAndAward(user, "network-master", allOfCategory(user, allChallenges, "Networking"));

        // Points badges
        checkAndAward(user, "points-500", user.getPoints() >= 500);
        checkAndAward(user, "points-1000", user.getPoints() >= 1000);

        // Top 10 badge
        List<AppUser> leaderboard = userRepository.findAllByOrderByPointsDesc();
        int rank = 0;
        for (int i = 0; i < leaderboard.size(); i++) {
            if (leaderboard.get(i).getId().equals(user.getId())) {
                rank = i + 1;
                break;
            }
        }
        checkAndAward(user, "top-10", rank > 0 && rank <= 10);
    }

    private boolean allOfDifficulty(AppUser user, List<Challenge> challenges, String difficulty) {
        List<Challenge> filtered = challenges.stream()
                .filter(c -> c.getDifficulty().equals(difficulty))
                .collect(Collectors.toList());
        if (filtered.isEmpty()) return false;
        return filtered.stream().allMatch(c -> user.getCompletedChallenges().contains(c.getChallengeKey()));
    }

    private boolean allOfCategory(AppUser user, List<Challenge> challenges, String category) {
        List<Challenge> filtered = challenges.stream()
                .filter(c -> c.getCategory().equals(category))
                .collect(Collectors.toList());
        if (filtered.isEmpty()) return false;
        return filtered.stream().allMatch(c -> user.getCompletedChallenges().contains(c.getChallengeKey()));
    }

    private void checkAndAward(AppUser user, String badgeKey, boolean condition) {
        if (condition && !badgeRepository.existsByUserIdAndBadgeKey(user.getId(), badgeKey)) {
            BadgeInfo info = BADGE_DEFINITIONS.get(badgeKey);
            if (info != null) {
                Badge badge = Badge.builder()
                        .badgeKey(badgeKey)
                        .name(info.name())
                        .description(info.description())
                        .icon(info.icon())
                        .user(user)
                        .earnedAt(LocalDateTime.now())
                        .build();
                badgeRepository.save(badge);
            }
        }
    }

    private ChallengeDto toDto(Challenge challenge) {
        return ChallengeDto.builder()
                .id(challenge.getId())
                .challengeKey(challenge.getChallengeKey())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .category(challenge.getCategory())
                .difficulty(challenge.getDifficulty())
                .points(challenge.getPoints())
                .question(challenge.getQuestion())
                .hints(challenge.getHints())
                .build();
    }

    private record BadgeInfo(String name, String description, String icon) {}
}
