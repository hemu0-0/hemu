package com.portfolio.domain.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectRequestDto {
    private String title;
    private String description;
    private String thumbnailUrl;
    private String githubUrl;
    private String demoUrl;
    private String period;
    private Integer orderIndex;
    private List<String> tags;
    private List<String> imageUrls;
}
