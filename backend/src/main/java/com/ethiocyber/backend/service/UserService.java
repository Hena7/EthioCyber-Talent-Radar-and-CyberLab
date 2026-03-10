package com.ethiocyber.backend.service;

import com.ethiocyber.backend.dto.BadgeDto;
import com.ethiocyber.backend.dto.UserDto;
import com.ethiocyber.backend.dto.UserProgressDto;
import com.ethiocyber.backend.entity.AppUser;
import com.ethiocyber.backend.entity.Badge;
import com.ethiocyber.backend.entity.UserProgress;
import com.ethiocyber.backend.repository.AppUserRepository;
import com.ethiocyber.backend.repository.BadgeRepository;
import com.ethiocyber.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AppUserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final UserProgressRepository userProgressRepository;

    public UserDto getUserByUsername(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDto(user);
    }

    public UserDto getUserById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getLeaderboard() {
        return userRepository.findAllByOrderByPointsDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserProgressDto> getAllProgress() {
        return userProgressRepository.findAll().stream()
                .map(this::toProgressDto)
                .collect(Collectors.toList());
    }

    public void resetLeaderboard() {
        List<AppUser> users = userRepository.findAll();
        for (AppUser user : users) {
            user.setPoints(0);
            user.getCompletedChallenges().clear();
        }
        userRepository.saveAll(users);
        badgeRepository.deleteAll();
        userProgressRepository.deleteAll();
    }

    private UserDto toDto(AppUser user) {
        List<Badge> badges = badgeRepository.findByUserId(user.getId());
        List<BadgeDto> badgeDtos = badges.stream()
                .map(b -> BadgeDto.builder()
                        .id(b.getBadgeKey())
                        .name(b.getName())
                        .description(b.getDescription())
                        .icon(b.getIcon())
                        .earnedAt(b.getEarnedAt())
                        .build())
                .collect(Collectors.toList());

        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .age(user.getAge())
                .university(user.getUniversity())
                .skills(user.getSkills())
                .points(user.getPoints())
                .completedChallenges(user.getCompletedChallenges())
                .badges(badgeDtos)
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private UserProgressDto toProgressDto(UserProgress p) {
        return UserProgressDto.builder()
                .userId(p.getUserId())
                .challengeId(p.getChallengeId())
                .completed(p.isCompleted())
                .completedAt(p.getCompletedAt())
                .pointsEarned(p.getPointsEarned())
                .build();
    }
}
