package com.portfolio.domain.project.controller;

import com.portfolio.domain.project.dto.ProjectRequestDto;
import com.portfolio.domain.project.dto.ProjectResponseDto;
import com.portfolio.domain.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponseDto>> getProjects() {
        return ResponseEntity.ok(projectService.getProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDto> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDto> createProject(@RequestBody ProjectRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDto> updateProject(@PathVariable Long id,
                                                             @RequestBody ProjectRequestDto dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
