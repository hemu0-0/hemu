package com.portfolio.domain.guestbook.controller;

import com.portfolio.domain.guestbook.dto.GuestbookDeleteRequestDto;
import com.portfolio.domain.guestbook.dto.GuestbookRequestDto;
import com.portfolio.domain.guestbook.dto.GuestbookResponseDto;
import com.portfolio.domain.guestbook.service.GuestbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookService guestbookService;

    @GetMapping
    public ResponseEntity<List<GuestbookResponseDto>> getEntries() {
        boolean isAdmin = isAdmin();
        return ResponseEntity.ok(guestbookService.getEntries(isAdmin));
    }

    @PostMapping
    public ResponseEntity<GuestbookResponseDto> create(@RequestBody GuestbookRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guestbookService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteByPassword(@PathVariable Long id,
                                                  @RequestBody GuestbookDeleteRequestDto dto) {
        guestbookService.deleteByPassword(id, dto.getPassword());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/admin")
    public ResponseEntity<Void> deleteByAdmin(@PathVariable Long id) {
        guestbookService.deleteByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal());
    }
}
