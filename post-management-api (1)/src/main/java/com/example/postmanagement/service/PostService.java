package com.example.postmanagement.service;

import com.example.postmanagement.exception.ResourceNotFoundException;
import com.example.postmanagement.model.Post;
import com.example.postmanagement.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final PostRepository repository;

    public PostService(PostRepository repository) {
        this.repository = repository;
    }

    public List<Post> getAllPosts() {
        return repository.findAll();
    }

    public Post getPostById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public Post createPost(Post post) {
        return repository.save(post);
    }

    public Post updatePost(Long id, Post post) {
        Post existing = getPostById(id);
        existing.setTitle(post.getTitle());
        existing.setContent(post.getContent());
        existing.setAuthor(post.getAuthor());
        return repository.save(existing);
    }

    public void deletePost(Long id) {
        Post existing = getPostById(id);
        repository.delete(existing);
    }
}
