package com.portfolio.domain.post.dto;

import com.portfolio.domain.post.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostResponseDto {
    private final Long id;
    private final String title;
    private final String content;
    private final String summary;
    private final String thumbnailUrl;
    private final List<String> tags;
    private final Integer views;
    private final Boolean isPublished;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.summary = post.getSummary();
        this.thumbnailUrl = post.getThumbnailUrl();
        this.tags = post.getTags().stream()
                .map(t -> t.getName())
                .sorted()
                .collect(Collectors.toList());
        this.views = post.getViews();
        this.isPublished = post.getIsPublished();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }
}
