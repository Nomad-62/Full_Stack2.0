// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
let postsData = [
  {
    id: '1',
    title: 'Getting Started with Redux Toolkit',
    content: 'Redux Toolkit simplifies Redux development by reducing boilerplate code.',
    platformId: 'twitter',
    status: 'published',
    createdAt: '2026-07-20T10:00:00Z',
    likes: 42,
  },
  {
    id: '2',
    title: 'React Best Practices 2026',
    content: 'Learn the latest patterns and practices for building React applications.',
    platformId: 'linkedin',
    status: 'draft',
    createdAt: '2026-07-21T14:30:00Z',
    likes: 18,
  },
  {
    id: '3',
    title: 'Introduction to State Normalization',
    content: 'Normalized state structures improve performance and reduce data redundancy.',
    platformId: 'facebook',
    status: 'published',
    createdAt: '2026-07-19T09:15:00Z',
    likes: 67,
  },
];

let platformsData = [
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2', isActive: true },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5', isActive: true },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#4267B2', isActive: true },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', isActive: false },
];

// Mock API functions
export const mockApi = {
  // Posts API
  fetchPosts: async () => {
    await delay(800);
    return [...postsData];
  },

  fetchPostById: async (id) => {
    await delay(500);
    const post = postsData.find((p) => p.id === id);
    if (!post) throw new Error('Post not found');
    return { ...post };
  },

  createPost: async (postData) => {
    await delay(600);
    const newPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    postsData.push(newPost);
    return newPost;
  },

  updatePost: async (id, updates) => {
    await delay(500);
    const index = postsData.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Post not found');
    postsData[index] = { ...postsData[index], ...updates };
    return { ...postsData[index] };
  },

  deletePost: async (id) => {
    await delay(400);
    const index = postsData.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Post not found');
    postsData.splice(index, 1);
    return id;
  },

  // Platforms API
  fetchPlatforms: async () => {
    await delay(500);
    return [...platformsData];
  },

  togglePlatform: async (id) => {
    await delay(300);
    const platform = platformsData.find((p) => p.id === id);
    if (!platform) throw new Error('Platform not found');
    platform.isActive = !platform.isActive;
    return { ...platform };
  },
};
