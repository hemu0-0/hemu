package com.portfolio.domain.guestbook.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "guestbook")
@Getter
@NoArgsConstructor
public class Guestbook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_secret")
    private boolean secret = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Guestbook(String name, String password, String message, boolean secret) {
        this.name = name;
        this.password = password;
        this.message = message;
        this.secret = secret;
    }
}
