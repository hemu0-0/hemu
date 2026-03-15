package com.portfolio.domain.project.entity;

import com.portfolio.domain.tag.entity.Tag;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "project")
@Getter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(length = 100)
    private String period;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "project_tag",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Project(String title, String description, String thumbnailUrl,
                   String githubUrl, String demoUrl, String period, Integer orderIndex) {
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.period = period;
        this.orderIndex = orderIndex != null ? orderIndex : 0;
    }

    public void update(String title, String description, String thumbnailUrl,
                       String githubUrl, String demoUrl, String period, Integer orderIndex) {
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.period = period;
        this.orderIndex = orderIndex != null ? orderIndex : 0;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
