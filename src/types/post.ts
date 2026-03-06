import { CoverConfig } from './cover';

export interface Tag {
  id: number;
  name: string;
}

export interface PostTag {
  tag: Tag;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  coverConfig?: CoverConfig | null;  // 封面配置
}

export interface CreatePostDto {
  title: string;
  content: string;
  tags: string[];
  coverConfig?: CoverConfig;  // 创建时可选封面配置
}

export interface UpdatePostDto {
  id: string
  data: CreatePostDto
}

export interface UpdateCoverDto {
  coverConfig: CoverConfig;
}

export interface TocItem {
  text: string;
  level: number;
  id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
