import instance from './axios';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await instance.post<{ url: string }>('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.url;
}
