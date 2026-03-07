import { api } from "@/utils/api";

export interface TagWithCount {
  id: number;
  name: string;
  postCount: number;
}

export const tagService = {
  async getAllTags(): Promise<TagWithCount[]> {
    const res = await api.get(`/tags`);
    return res;
  },
};
