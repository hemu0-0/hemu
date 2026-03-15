import instance from './axios';
import type { Project, ProjectRequest } from '../types';

export const getProjects = () =>
  instance.get<Project[]>('/api/projects').then((r) => r.data);

export const createProject = (data: ProjectRequest) =>
  instance.post<Project>('/api/projects', data).then((r) => r.data);

export const updateProject = (id: number, data: ProjectRequest) =>
  instance.put<Project>(`/api/projects/${id}`, data).then((r) => r.data);

export const deleteProject = (id: number) =>
  instance.delete(`/api/projects/${id}`);
