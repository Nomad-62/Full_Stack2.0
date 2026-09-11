package com.example.postmanagement.controller;

import com.example.postmanagement.dto.ApiResponse;
import com.example.postmanagement.model.Post;
import com.example.postmanagement.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {
    private final PostService service;

    public PostController(PostService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> getAllPosts() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Posts retrieved successfully", service.getAllPosts())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Post retrieved successfully", service.getPostById(id))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(@Valid @RequestBody Post post) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Post created successfully", service.createPost(post))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody Post post) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Post updated successfully", service.updatePost(id, post))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        service.deletePost(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Post deleted successfully", null)
        );
    }
}
