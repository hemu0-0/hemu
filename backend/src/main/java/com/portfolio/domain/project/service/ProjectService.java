package com.portfolio.domain.project.service;

import com.portfolio.domain.project.dto.ProjectRequestDto;
import com.portfolio.domain.project.dto.ProjectResponseDto;
import com.portfolio.domain.project.entity.Project;
import com.portfolio.domain.project.repository.ProjectRepository;
import com.portfolio.domain.tag.entity.Tag;
import com.portfolio.domain.tag.repository.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;

    public List<ProjectResponseDto> getProjects() {
        return projectRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(ProjectResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto dto) {
        Project project = Project.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .thumbnailUrl(dto.getThumbnailUrl())
                .githubUrl(dto.getGithubUrl())
                .demoUrl(dto.getDemoUrl())
                .period(dto.getPeriod())
                .orderIndex(dto.getOrderIndex())
                .build();
        project.setTags(resolveTags(dto.getTags()));
        return new ProjectResponseDto(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponseDto updateProject(Long id, ProjectRequestDto dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found: " + id));
        project.update(dto.getTitle(), dto.getDescription(), dto.getThumbnailUrl(),
                dto.getGithubUrl(), dto.getDemoUrl(), dto.getPeriod(), dto.getOrderIndex());
        project.setTags(resolveTags(dto.getTags()));
        return new ProjectResponseDto(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found: " + id));
        projectRepository.delete(project);
    }

    private Set<Tag> resolveTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return new HashSet<>();
        return tagNames.stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(name))))
                .collect(Collectors.toSet());
    }
}
