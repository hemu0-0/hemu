package com.portfolio.domain.guestbook.dto;

import com.portfolio.domain.guestbook.entity.Guestbook;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class GuestbookResponseDto {
    private final Long id;
    private final String name;
    private final String message;
    private final boolean secret;
    private final LocalDateTime createdAt;

    public GuestbookResponseDto(Guestbook g, boolean isAdmin) {
        this.id = g.getId();
        this.name = g.getName();
        this.secret = g.isSecret();
        this.createdAt = g.getCreatedAt();
        this.message = (g.isSecret() && !isAdmin) ? "비밀글입니다." : g.getMessage();
    }
}
