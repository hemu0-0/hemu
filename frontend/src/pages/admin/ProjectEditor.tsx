import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, ImagePlus, Plus, X } from 'lucide-react';
import { getProjects, createProject, updateProject } from '../../api/projectApi';
import { uploadImage } from '../../api/supabase';
import type { ProjectRequest } from '../../types';
import Button from '../../components/common/Button';

const emptyForm: ProjectRequest = {
  title: '',
  description: '',
  thumbnailUrl: '',
  githubUrl: '',
  demoUrl: '',
  period: '',
  tags: [],
  orderIndex: 0,
  imageUrls: [],
};

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<ProjectRequest>(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const extraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    getProjects().then((projects) => {
      const project = projects.find((p) => p.id === Number(id));
      if (project) {
        setForm({
          title: project.title,
          description: project.description,
          thumbnailUrl: project.thumbnailUrl || '',
          githubUrl: project.githubUrl || '',
          demoUrl: project.demoUrl || '',
          period: project.period || '',
          tags: project.tags,
          orderIndex: project.orderIndex,
          imageUrls: project.imageUrls || [],
        });
        setTagInput(project.tags.join(', '));
      }
    });
  }, [id, isEdit]);

  const handleTagBlur = () => {
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    setForm((f) => ({ ...f, tags }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleTagBlur(); }
  };

  const set = (key: keyof ProjectRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, thumbnailUrl: url }));
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleExtraImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingExtra(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      setForm((f) => ({ ...f, imageUrls: [...(f.imageUrls ?? []), ...urls] }));
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingExtra(false);
      e.target.value = '';
    }
  };

  const removeExtraImage = (index: number) => {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await updateProject(Number(id), form);
      } else {
        await createProject(form);
      }
      navigate('/admin/dashboard');
    } catch {
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={14} /> 대시보드로
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {isEdit ? '프로젝트 수정' : '새 프로젝트'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 썸네일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지</label>
          <input ref={thumbnailRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
          {form.thumbnailUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
              <img src={form.thumbnailUrl} alt="썸네일" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, thumbnailUrl: '' }))}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => thumbnailRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition-colors"
            >
              <ImagePlus size={28} />
              <span className="text-sm">{uploading ? '업로드 중...' : '클릭해서 이미지 선택'}</span>
            </button>
          )}
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
          <input
            type="text"
            value={form.title}
            onChange={set('title')}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* 설명 (마크다운) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
          <div data-color-mode="light">
            <MDEditor
              value={form.description}
              onChange={(val) => setForm((f) => ({ ...f, description: val || '' }))}
              height={300}
            />
          </div>
        </div>

        {/* 추가 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">추가 이미지 (스크린샷)</label>
          <input ref={extraRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtraImageChange} />
          <div className="grid grid-cols-3 gap-3">
            {(form.imageUrls ?? []).map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={url} alt={`extra-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExtraImage(i)}
                  className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => extraRef.current?.click()}
              disabled={uploadingExtra}
              className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition-colors"
            >
              <Plus size={20} />
              <span className="text-xs">{uploadingExtra ? '업로드 중...' : '추가'}</span>
            </button>
          </div>
        </div>

        {/* 기타 필드 */}
        {[
          { label: 'GitHub URL (선택)', key: 'githubUrl' as const },
          { label: '데모 URL (선택)', key: 'demoUrl' as const },
          { label: '기간 (선택, ex: 2024.01 ~ 2024.03)', key: 'period' as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              value={form[key] as string}
              onChange={set(key)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        ))}

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표 또는 엔터로 구분)</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={handleTagBlur}
            onKeyDown={handleTagKeyDown}
            placeholder="React, Spring Boot"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {form.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* 정렬 순서 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
          <input
            type="number"
            value={form.orderIndex}
            onChange={(e) => setForm((f) => ({ ...f, orderIndex: Number(e.target.value) }))}
            className="w-24 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving || uploading || uploadingExtra}>
            {saving ? '저장 중...' : '저장'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/dashboard')}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
