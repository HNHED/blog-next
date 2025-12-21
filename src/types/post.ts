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
}

export interface CreatePostDto {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdatePostDto {
  id: string
  data: CreatePostDto
}

export interface TocItem {
  text: string;
  level: number;
  id: string;
}

