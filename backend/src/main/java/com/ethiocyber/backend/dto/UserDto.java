package com.ethiocyber.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private int age;
    private String university;
    private List<String> skills;
    private int points;
    private List<String> completedChallenges;
    private List<BadgeDto> badges;
    private String role;
    private LocalDateTime createdAt;
}
