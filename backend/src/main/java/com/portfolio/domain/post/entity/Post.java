package com.portfolio.domain.post.entity;

import com.portfolio.domain.tag.entity.Tag;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 500)
    private String summary;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = false;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "post_tag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Post(String title, String content, String summary, String thumbnailUrl, Boolean isPublished) {
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished != null ? isPublished : false;
        this.views = 0;
    }

    public void update(String title, String content, String summary, String thumbnailUrl, Boolean isPublished) {
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished != null ? isPublished : false;
    }

    public void incrementViews() {
        this.views++;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
