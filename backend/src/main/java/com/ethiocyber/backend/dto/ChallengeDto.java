package com.ethiocyber.backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeDto {
    private Long id;
    private String challengeKey;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private int points;
    private String question;
    private List<String> hints;
}
