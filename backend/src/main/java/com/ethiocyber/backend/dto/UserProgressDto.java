package com.ethiocyber.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgressDto {
    private Long userId;
    private String challengeId;
    private boolean completed;
    private LocalDateTime completedAt;
    private int pointsEarned;
}
