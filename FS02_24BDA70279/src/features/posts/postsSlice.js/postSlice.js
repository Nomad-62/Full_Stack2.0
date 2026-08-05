import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { mockApi } from '../../services/mockApi';

// Entity adapter for normalized state
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

// Initial state using adapter
const initialState = postsAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedPostId: null,
  filters: {
    platform: 'all',
    status: 'all',
  },
});

// Async thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await mockApi.fetchPosts();
  return response;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (postData) => {
  const response = await mockApi.createPost(postData);
  return response;
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, updates }) => {
  const response = await mockApi.updatePost(id, updates);
  return response;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await mockApi.deletePost(id);
  return id;
});

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Synchronous actions
    setSelectedPost: (state, action) => {
      state.selectedPostId = action.payload;
    },
    clearSelectedPost: (state) => {
      state.selectedPostId = null;
    },
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    clearFilters: (state) => {
      state.filters = { platform: 'all', status: 'all' };
    },
    incrementLikes: (state, action) => {
      const post = state.entities[action.payload];
      if (post) {
        post.likes += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add new post
      .addCase(addNewPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
        if (state.selectedPostId === action.payload) {
          state.selectedPostId = null;
        }
      });
  },
});

// Export actions
export const {
  setSelectedPost,
  clearSelectedPost,
  setFilter,
  clearFilters,
  incrementLikes,
} = postsSlice.actions;

// Selectors from adapter
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

// Custom selectors
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
export const selectSelectedPostId = (state) => state.posts.selectedPostId;
export const selectFilters = (state) => state.posts.filters;

// Filtered posts selector
export const selectFilteredPosts = (state) => {
  const allPosts = selectAllPosts(state);
  const filters = selectFilters(state);

  return allPosts.filter((post) => {
    const platformMatch = filters.platform === 'all' || post.platformId === filters.platform;
    const statusMatch = filters.status === 'all' || post.status === filters.status;
    return platformMatch && statusMatch;
  });
};

// Posts count by platform
export const selectPostsCountByPlatform = (state) => {
  const allPosts = selectAllPosts(state);
  return allPosts.reduce((counts, post) => {
    counts[post.platformId] = (counts[post.platformId] || 0) + 1;
    return counts;
  }, {});
};

export default postsSlice.reducer;
