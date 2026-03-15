import instance from './axios';
import type { LoginRequest, LoginResponse } from '../types';

export const login = (data: LoginRequest) =>
  instance.post<LoginResponse>('/api/auth/login', data).then((r) => r.data);
