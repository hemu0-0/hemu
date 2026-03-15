import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft } from 'lucide-react';
import { getPost, createPost, updatePost } from '../../api/postApi';
import type { PostRequest } from '../../types';
import Button from '../../components/common/Button';

const emptyForm: PostRequest = {
  title: '',
  content: '',
  summary: '',
  thumbnailUrl: '',
  tags: [],
  isPublished: false,
};

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<PostRequest>(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getPost(Number(id))
      .then((post) => {
        setForm({
          title: post.title,
          content: post.content,
          summary: post.summary || '',
          thumbnailUrl: post.thumbnailUrl || '',
          tags: post.tags,
          isPublished: post.isPublished,
        });
        setTagInput(post.tags.join(', '));
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleTagBlur = () => {
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((f) => ({ ...f, tags }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagBlur();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await updatePost(Number(id), form);
      } else {
        await createPost(form);
      }
      navigate('/admin/dashboard');
    } catch {
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">불러오는 중...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={14} /> 대시보드로
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {isEdit ? '글 수정' : '새 글 작성'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
          <div data-color-mode="light">
            <MDEditor
              value={form.content}
              onChange={(val) => setForm((f) => ({ ...f, content: val || '' }))}
              height={500}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">요약 (선택)</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 URL (선택)</label>
          <input
            type="url"
            value={form.thumbnailUrl}
            onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            태그 (쉼표 또는 엔터로 구분)
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={handleTagBlur}
            onKeyDown={handleTagKeyDown}
            placeholder="React, TypeScript, Spring"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {form.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            className="w-4 h-4 accent-indigo-600"
          />
          <label htmlFor="isPublished" className="text-sm text-gray-700">발행하기</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/dashboard')}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
