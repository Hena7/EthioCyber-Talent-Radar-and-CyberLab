package com.ethiocyber.backend.controller;

import com.ethiocyber.backend.dto.ChallengeCreateRequest;
import com.ethiocyber.backend.dto.ChallengeDto;
import com.ethiocyber.backend.dto.UserDto;
import com.ethiocyber.backend.service.ChallengeService;
import com.ethiocyber.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ChallengeService challengeService;
    private final UserService userService;

    @PostMapping("/challenges")
    public ResponseEntity<ChallengeDto> createChallenge(@Valid @RequestBody ChallengeCreateRequest request) {
        return ResponseEntity.ok(challengeService.createChallenge(request));
    }

    @PutMapping("/challenges/{key}")
    public ResponseEntity<ChallengeDto> updateChallenge(
            @PathVariable String key,
            @Valid @RequestBody ChallengeCreateRequest request) {
        return ResponseEntity.ok(challengeService.updateChallenge(key, request));
    }

    @DeleteMapping("/challenges/{key}")
    public ResponseEntity<Map<String, String>> deleteChallenge(@PathVariable String key) {
        challengeService.deleteChallenge(key);
        return ResponseEntity.ok(Map.of("message", "Challenge deleted successfully"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/reset-leaderboard")
    public ResponseEntity<Map<String, String>> resetLeaderboard() {
        userService.resetLeaderboard();
        return ResponseEntity.ok(Map.of("message", "Leaderboard reset successfully"));
    }
}
