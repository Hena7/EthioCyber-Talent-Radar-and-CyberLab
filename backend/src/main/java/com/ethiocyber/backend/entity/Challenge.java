package com.ethiocyber.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String challengeKey;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String difficulty;

    private int points;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false)
    private String answer;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "challenge_hints", joinColumns = @JoinColumn(name = "challenge_id"))
    @Column(name = "hint")
    @Builder.Default
    private List<String> hints = new ArrayList<>();
}
