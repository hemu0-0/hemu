package com.portfolio.domain.post.service;

import com.portfolio.domain.post.dto.PostRequestDto;
import com.portfolio.domain.post.dto.PostResponseDto;
import com.portfolio.domain.post.entity.Post;
import com.portfolio.domain.post.repository.PostRepository;
import com.portfolio.domain.tag.entity.Tag;
import com.portfolio.domain.tag.repository.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    public Page<PostResponseDto> getPosts(String tag, Pageable pageable) {
        Page<Post> posts;
        if (StringUtils.hasText(tag)) {
            posts = postRepository.findByIsPublishedTrueAndTagName(tag, pageable);
        } else {
            posts = postRepository.findByIsPublishedTrue(pageable);
        }
        List<PostResponseDto> dtos = posts.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, posts.getTotalElements());
    }

    @Transactional
    public PostResponseDto getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found: " + id));
        post.incrementViews();
        return toDto(post);
    }

    @Transactional
    public PostResponseDto createPost(PostRequestDto dto) {
        String summary = resolveSummary(dto.getSummary(), dto.getContent());
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .summary(summary)
                .thumbnailUrl(dto.getThumbnailUrl())
                .isPublished(dto.getIsPublished())
                .build();
        post.setTags(resolveTags(dto.getTags()));
        return toDto(postRepository.save(post));
    }

    @Transactional
    public PostResponseDto updatePost(Long id, PostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found: " + id));
        String summary = resolveSummary(dto.getSummary(), dto.getContent());
        post.update(dto.getTitle(), dto.getContent(), summary, dto.getThumbnailUrl(), dto.getIsPublished());
        post.setTags(resolveTags(dto.getTags()));
        return toDto(post);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found: " + id));
        postRepository.delete(post);
    }

    private Set<Tag> resolveTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return new HashSet<>();
        return tagNames.stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(name))))
                .collect(Collectors.toSet());
    }

    private String resolveSummary(String summary, String content) {
        if (StringUtils.hasText(summary)) return summary;
        if (content == null || content.isEmpty()) return "";
        return content.length() > 100 ? content.substring(0, 100) : content;
    }

    private PostResponseDto toDto(Post post) {
        return new PostResponseDto(post);
    }
}
