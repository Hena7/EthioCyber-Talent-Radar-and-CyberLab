package com.ethiocyber.backend.controller;

import com.ethiocyber.backend.dto.ChallengeDto;
import com.ethiocyber.backend.dto.SubmitAnswerRequest;
import com.ethiocyber.backend.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<List<ChallengeDto>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    @GetMapping("/{key}")
    public ResponseEntity<ChallengeDto> getChallenge(@PathVariable String key) {
        return ResponseEntity.ok(challengeService.getChallengeByKey(key));
    }

    @PostMapping("/{key}/submit")
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @PathVariable String key,
            @Valid @RequestBody SubmitAnswerRequest request,
            Authentication authentication) {

        boolean correct = challengeService.submitAnswer(
                authentication.getName(), key, request.getAnswer());

        return ResponseEntity.ok(Map.of(
                "correct", correct,
                "message", correct ? "Correct answer! Points awarded." : "Incorrect answer or already completed."
        ));
    }
}
