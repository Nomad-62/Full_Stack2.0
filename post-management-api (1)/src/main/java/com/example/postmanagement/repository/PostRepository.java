package com.example.postmanagement.repository;

import com.example.postmanagement.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
