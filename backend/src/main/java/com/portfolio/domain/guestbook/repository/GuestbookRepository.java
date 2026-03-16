package com.portfolio.domain.guestbook.repository;

import com.portfolio.domain.guestbook.entity.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestbookRepository extends JpaRepository<Guestbook, Long> {
    List<Guestbook> findAllByOrderByCreatedAtDesc();
}
