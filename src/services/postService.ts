import { Post, CreatePostDto, type UpdatePostDto, type UpdateCoverDto, type PaginatedResponse } from "@/types/post";
import { api, BASE_URL } from "@/utils/api";

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    return await api.get(`/posts`);
  },

  async getPosts(params?: { page?: number; limit?: number; tag?: string }): Promise<PaginatedResponse<Post>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.tag) query.set('tag', params.tag);
    const qs = query.toString();
    const res = await api.get(`/posts/paginated${qs ? `?${qs}` : ''}`);
    return res;
  },

  // 用于详情页 Server Component
  async getPostById(id: string): Promise<Post> {
    return api.get(`/posts/${id}`);
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
    const res = await fetch(`${BASE_URL}/posts/search?q=${encodeURIComponent(keyword)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('搜索失败');
    return res.json();
  },
};
