package com.portfolio.domain.guestbook.service;

import com.portfolio.domain.guestbook.dto.GuestbookRequestDto;
import com.portfolio.domain.guestbook.dto.GuestbookResponseDto;
import com.portfolio.domain.guestbook.entity.Guestbook;
import com.portfolio.domain.guestbook.repository.GuestbookRepository;
import com.portfolio.global.exception.CustomException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuestbookService {

    private final GuestbookRepository guestbookRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<GuestbookResponseDto> getEntries(boolean isAdmin) {
        return guestbookRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(g -> new GuestbookResponseDto(g, isAdmin))
                .collect(Collectors.toList());
    }

    @Transactional
    public GuestbookResponseDto create(GuestbookRequestDto dto) {
        Guestbook entry = Guestbook.builder()
                .name(dto.getName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .message(dto.getMessage())
                .secret(dto.isSecret())
                .build();
        return new GuestbookResponseDto(guestbookRepository.save(entry), false);
    }

    @Transactional
    public void deleteByPassword(Long id, String password) {
        Guestbook entry = guestbookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entry not found: " + id));
        if (!passwordEncoder.matches(password, entry.getPassword())) {
            throw new CustomException("비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
        }
        guestbookRepository.delete(entry);
    }

    @Transactional
    public void deleteByAdmin(Long id) {
        Guestbook entry = guestbookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entry not found: " + id));
        guestbookRepository.delete(entry);
    }
}
