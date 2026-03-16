package com.portfolio.domain.project.dto;

import com.portfolio.domain.project.entity.Project;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ProjectResponseDto {
    private final Long id;
    private final String title;
    private final String description;
    private final String thumbnailUrl;
    private final String githubUrl;
    private final String demoUrl;
    private final String period;
    private final Integer orderIndex;
    private final List<String> tags;
    private final List<String> imageUrls;

    public ProjectResponseDto(Project project) {
        this.id = project.getId();
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.thumbnailUrl = project.getThumbnailUrl();
        this.githubUrl = project.getGithubUrl();
        this.demoUrl = project.getDemoUrl();
        this.period = project.getPeriod();
        this.orderIndex = project.getOrderIndex();
        this.tags = project.getTags().stream()
                .map(t -> t.getName())
                .sorted()
                .collect(Collectors.toList());
        this.imageUrls = project.getImageUrls();
    }
}
