package com.ethiocyber.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String challengeId;

    @Builder.Default
    private boolean completed = true;

    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();

    private int pointsEarned;
}
