import instance from './axios';
import type { GuestbookEntry, GuestbookRequest } from '../types';

export const getEntries = () =>
  instance.get<GuestbookEntry[]>('/api/guestbook').then((r) => r.data);

export const createEntry = (data: GuestbookRequest) =>
  instance.post<GuestbookEntry>('/api/guestbook', data).then((r) => r.data);

export const deleteByPassword = (id: number, password: string) =>
  instance.delete(`/api/guestbook/${id}`, { data: { password } });

export const deleteByAdmin = (id: number) =>
  instance.delete(`/api/guestbook/${id}/admin`);
