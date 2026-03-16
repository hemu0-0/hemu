export interface Post {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export interface PostDetail extends Post {
  content: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
  summary?: string;
  thumbnailUrl?: string;
  tags: string[];
  isPublished: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  period?: string;
  tags: string[];
  orderIndex: number;
  imageUrls?: string[];
}

export interface ProjectRequest {
  title: string;
  description: string;
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  period?: string;
  tags: string[];
  orderIndex: number;
  imageUrls: string[];
}

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  secret: boolean;
  createdAt: string;
}

export interface GuestbookRequest {
  name: string;
  password: string;
  message: string;
  secret: boolean;
}

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
}
