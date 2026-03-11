package com.ethiocyber.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Min(value = 20, message = "Age must be between 20 and 30")
    @Max(value = 30, message = "Age must be between 20 and 30")
    private int age;

    @NotBlank(message = "University is required")
    private String university;

    @NotEmpty(message = "Select at least one skill")
    private List<String> skills;
}
