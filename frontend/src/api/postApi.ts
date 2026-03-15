import instance from './axios';
import type { Post, PostDetail, PostRequest, PageResponse } from '../types';

export const getPosts = (params?: { tag?: string; page?: number; size?: number }) =>
  instance.get<PageResponse<Post>>('/api/posts', { params }).then((r) => r.data);

export const getPost = (id: number) =>
  instance.get<PostDetail>(`/api/posts/${id}`).then((r) => r.data);

export const createPost = (data: PostRequest) =>
  instance.post<PostDetail>('/api/posts', data).then((r) => r.data);

export const updatePost = (id: number, data: PostRequest) =>
  instance.put<PostDetail>(`/api/posts/${id}`, data).then((r) => r.data);

export const deletePost = (id: number) =>
  instance.delete(`/api/posts/${id}`);
