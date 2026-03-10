package com.ethiocyber.backend.config;

import com.ethiocyber.backend.entity.AppUser;
import com.ethiocyber.backend.entity.Challenge;
import com.ethiocyber.backend.entity.Role;
import com.ethiocyber.backend.repository.AppUserRepository;
import com.ethiocyber.backend.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ChallengeRepository challengeRepository;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed challenges if empty
        if (challengeRepository.count() == 0) {
            seedChallenges();
        }

        // Seed admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            AppUser admin = AppUser.builder()
                    .fullName("Admin User")
                    .username("admin")
                    .email("admin@ethiocyber.com")
                    .password(passwordEncoder.encode("admin123"))
                    .age(25)
                    .university("Admin")
                    .skills(List.of("Cybersecurity", "Programming"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }

    private void seedChallenges() {
        List<Challenge> challenges = List.of(
                Challenge.builder()
                        .challengeKey("phishing-1")
                        .title("Phishing Email Detection")
                        .description("Identify the telltale signs of a phishing email. Analyze the given email and determine if it is legitimate or a phishing attempt.")
                        .category("Phishing Detection").difficulty("Easy").points(100)
                        .question("You receive an email from \"security@g00gle-support.com\" asking you to verify your account by clicking a link. What type of attack is this?")
                        .answer("phishing")
                        .hints(List.of("Look at the sender domain carefully", "Legitimate companies use their official domains"))
                        .build(),
                Challenge.builder()
                        .challengeKey("phishing-2")
                        .title("Social Engineering Awareness")
                        .description("Test your knowledge of social engineering tactics used in cybersecurity attacks.")
                        .category("Phishing Detection").difficulty("Medium").points(200)
                        .question("An attacker calls pretending to be IT support and asks for your password to \"fix an issue.\" What social engineering technique is this?")
                        .answer("pretexting")
                        .hints(List.of("The attacker creates a fabricated scenario", "This involves impersonation"))
                        .build(),
                Challenge.builder()
                        .challengeKey("password-1")
                        .title("Password Strength Analysis")
                        .description("Learn what makes a strong password and test your understanding of password security best practices.")
                        .category("Password Security").difficulty("Easy").points(100)
                        .question("Which of the following is the strongest password? a) password123 b) P@ssw0rd c) xK9#mQ2$vL7! d) qwerty. Enter the letter only.")
                        .answer("c")
                        .hints(List.of("Strong passwords use a mix of characters", "Length and complexity matter"))
                        .build(),
                Challenge.builder()
                        .challengeKey("password-2")
                        .title("Password Hashing Concepts")
                        .description("Understand the importance of password hashing and how it protects user credentials in databases.")
                        .category("Password Security").difficulty("Medium").points(200)
                        .question("What is the name of the technique that adds random data to a password before hashing to prevent rainbow table attacks?")
                        .answer("salting")
                        .hints(List.of("It adds something extra before hashing", "Think of seasoning food"))
                        .build(),
                Challenge.builder()
                        .challengeKey("websec-1")
                        .title("Cross-Site Scripting (XSS)")
                        .description("Learn about XSS vulnerabilities and how they can be exploited to inject malicious scripts into web applications.")
                        .category("Web Security").difficulty("Medium").points(200)
                        .question("What type of web vulnerability allows an attacker to inject malicious scripts into web pages viewed by other users? (abbreviation)")
                        .answer("xss")
                        .hints(List.of("It involves scripting across sites", "It is a three-letter abbreviation"))
                        .build(),
                Challenge.builder()
                        .challengeKey("websec-2")
                        .title("SQL Injection Basics")
                        .description("Understand how SQL injection works and learn methods to prevent this common web security vulnerability.")
                        .category("Web Security").difficulty("Hard").points(300)
                        .question("In a SQL injection attack, what SQL clause is commonly manipulated to bypass login authentication? (e.g., attacker inputs: ' OR '1'='1)")
                        .answer("where")
                        .hints(List.of("This clause filters database results", "It determines which records match conditions"))
                        .build(),
                Challenge.builder()
                        .challengeKey("websec-3")
                        .title("CSRF Attack Prevention")
                        .description("Learn about Cross-Site Request Forgery attacks and how to implement proper defenses against them.")
                        .category("Web Security").difficulty("Hard").points(300)
                        .question("What type of token is commonly used to prevent CSRF attacks by verifying that a request came from the legitimate website?")
                        .answer("csrf token")
                        .hints(List.of("It is a unique value included in forms", "It verifies the request origin"))
                        .build(),
                Challenge.builder()
                        .challengeKey("crypto-1")
                        .title("Caesar Cipher Challenge")
                        .description("Decode a message encrypted with the classic Caesar cipher. Apply your knowledge of substitution ciphers.")
                        .category("Cryptography").difficulty("Easy").points(100)
                        .question("Decrypt this Caesar cipher (shift of 3): \"KHOOR ZRUOG\". What is the original message? (lowercase)")
                        .answer("hello world")
                        .hints(List.of("Each letter is shifted by 3 positions", "K shifted back 3 positions becomes H"))
                        .build(),
                Challenge.builder()
                        .challengeKey("crypto-2")
                        .title("Encryption Types")
                        .description("Test your understanding of different encryption methods and when to use symmetric vs asymmetric encryption.")
                        .category("Cryptography").difficulty("Medium").points(200)
                        .question("What type of encryption uses the same key for both encryption and decryption?")
                        .answer("symmetric")
                        .hints(List.of("Both parties share one key", "AES is an example of this type"))
                        .build(),
                Challenge.builder()
                        .challengeKey("crypto-3")
                        .title("Public Key Cryptography")
                        .description("Explore the concepts behind public key infrastructure and asymmetric encryption algorithms.")
                        .category("Cryptography").difficulty("Hard").points(300)
                        .question("What is the name of the widely-used asymmetric encryption algorithm named after its three inventors? (abbreviation)")
                        .answer("rsa")
                        .hints(List.of("Named after Rivest, Shamir, and Adleman", "It is a three-letter abbreviation"))
                        .build(),
                Challenge.builder()
                        .challengeKey("network-1")
                        .title("Network Protocols")
                        .description("Test your knowledge of common network protocols and their functions in computer networking.")
                        .category("Networking").difficulty("Easy").points(100)
                        .question("What protocol is used to securely transfer files over a network, replacing the older FTP? (abbreviation)")
                        .answer("sftp")
                        .hints(List.of("It adds security to file transfers", "It uses SSH for encryption"))
                        .build(),
                Challenge.builder()
                        .challengeKey("network-2")
                        .title("Firewall Concepts")
                        .description("Understand how firewalls work and their role in network security architecture.")
                        .category("Networking").difficulty("Medium").points(200)
                        .question("What network security device monitors and filters incoming and outgoing network traffic based on predetermined security rules?")
                        .answer("firewall")
                        .hints(List.of("It acts as a barrier between networks", "It can be hardware or software"))
                        .build(),
                Challenge.builder()
                        .challengeKey("network-3")
                        .title("Network Attack Detection")
                        .description("Learn to identify different types of network attacks and understand their impact on system security.")
                        .category("Networking").difficulty("Hard").points(300)
                        .question("What type of attack floods a target with traffic from multiple compromised systems to make it unavailable? (abbreviation)")
                        .answer("ddos")
                        .hints(List.of("It involves distributed systems", "It causes denial of service"))
                        .build(),
                Challenge.builder()
                        .challengeKey("phishing-3")
                        .title("URL Analysis")
                        .description("Practice analyzing URLs to identify potential phishing and malicious websites.")
                        .category("Phishing Detection").difficulty("Hard").points(300)
                        .question("What technique do attackers use to register domain names that are similar to legitimate ones with slight misspellings (e.g., gooogle.com)?")
                        .answer("typosquatting")
                        .hints(List.of("It exploits common typing errors", "Also known as URL hijacking"))
                        .build(),
                Challenge.builder()
                        .challengeKey("password-3")
                        .title("Multi-Factor Authentication")
                        .description("Explore the concepts and importance of multi-factor authentication in modern security systems.")
                        .category("Password Security").difficulty("Hard").points(300)
                        .question("What are the three factors of authentication? Something you know, something you have, and something you ___.")
                        .answer("are")
                        .hints(List.of("Think about biometrics", "Fingerprints and facial recognition fall into this category"))
                        .build()
        );

        challengeRepository.saveAll(challenges);
    }
}
