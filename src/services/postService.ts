import { Post, CreatePostDto, type UpdatePostDto, type UpdateCoverDto } from "@/types/post";
import { api } from "@/utils/api";

const API_URL = 'http://localhost:3333';

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
    if (!res.ok) throw new Error('获取文章失败');
    return res.json();
  },

  // 用于详情页 Server Component
  async getPostById(id: string): Promise<Post> {
    const res = await fetch(`${API_URL}/posts/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('文章不存在');
    return res.json();
  },

  // 用于发布页 Client Component (使用封装好的 api 客户端)
  async createPost(data: CreatePostDto) {
    return api.post('/posts', data);
  },

    // 用于发布页 Client Component (使用封装好的 api 客户端)
  async updatePost({id, data}: UpdatePostDto) {
    return api.put(`/posts/${id}`, data);
  },

  // 用于删除
  async deletePost(id: string) {
    return api.delete(`/posts/${id}`);
  },

  // 更新封面配置
  async updateCover(id: string, data: UpdateCoverDto) {
    return api.put(`/posts/${id}/cover`, data);
  },

  // 搜索文章
  async searchPosts(keyword: string): Promise<Post[]> {
    const res = await fetch(`${API_URL}/posts/search?q=${encodeURIComponent(keyword)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('搜索失败');
    return res.json();
  },
};
