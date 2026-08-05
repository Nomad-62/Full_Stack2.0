import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchPosts,
  selectFilteredPosts,
  selectPostsStatus,
  selectPostsError,
  setFilter,
  selectFilters,
} from './postsSlice';
import { selectAllPlatforms } from '../platforms/platformsSlice';
import PostItem from './PostItem';
import AddPostForm from './AddPostForm';

const PostsList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectFilteredPosts);
  const status = useAppSelector(selectPostsStatus);
  const error = useAppSelector(selectPostsError);
  const filters = useAppSelector(selectFilters);
  const platforms = useAppSelector(selectAllPlatforms);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ filterType, value }));
  };

  if (status === 'loading') {
    return <div className="loading">Loading posts...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="posts-container">
      <h2>📝 Posts Management</h2>

      <AddPostForm />

      <div className="filters">
        <label>
          Platform:
          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
          >
            <option value="all">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.icon} {platform.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status:
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p className="no-posts">No posts found matching your filters.</p>
        ) : (
          posts.map((post) => <PostItem key={post.id} postId={post.id} />)
        )}
      </div>
    </div>
  );
};

export default PostsList;
