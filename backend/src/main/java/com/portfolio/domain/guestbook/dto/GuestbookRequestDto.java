package com.portfolio.domain.guestbook.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GuestbookRequestDto {
    private String name;
    private String password;
    private String message;
    private boolean secret;
}
