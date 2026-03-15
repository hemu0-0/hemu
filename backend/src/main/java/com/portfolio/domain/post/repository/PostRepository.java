package com.portfolio.domain.post.repository;

import com.portfolio.domain.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByIsPublishedTrue(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t WHERE p.isPublished = true AND t.name = :tagName")
    Page<Post> findByIsPublishedTrueAndTagName(@Param("tagName") String tagName, Pageable pageable);
}
