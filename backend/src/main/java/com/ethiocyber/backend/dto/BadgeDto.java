package com.ethiocyber.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadgeDto {
    private String id;
    private String name;
    private String description;
    private String icon;
    private LocalDateTime earnedAt;
}
