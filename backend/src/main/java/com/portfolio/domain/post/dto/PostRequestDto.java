package com.portfolio.domain.post.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class PostRequestDto {
    private String title;
    private String content;
    private String summary;
    private String thumbnailUrl;
    private List<String> tags;
    private Boolean isPublished;
}
