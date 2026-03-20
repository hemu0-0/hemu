import { useEffect, useState } from 'react';
import { Lock, Trash2 } from 'lucide-react';
import { getEntries, createEntry, deleteByPassword } from '../api/guestbookApi';
import type { GuestbookEntry, GuestbookRequest } from '../types';
import Spinner from '../components/common/Spinner';
import Footer from '../components/layout/Footer';

const emptyForm: GuestbookRequest = { name: '', password: '', message: '', secret: false };

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${props.className ?? ''}`}
      style={{
        background: 'var(--input-bg)',
        border: '1px solid var(--border)',
        color: 'var(--text-hi)',
        ...props.style,
      }}
    />
  );
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<GuestbookRequest>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletePassword, setDeletePassword] = useState('');

  const load = () =>
    getEntries().then(setEntries).catch(() => setEntries([])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.password.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await createEntry(form);
      setForm(emptyForm);
      load();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 429) alert('잠시 후 다시 시도해주세요. (1분에 3회 제한)');
      else alert('등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!deletePassword.trim()) return;
    try {
      await deleteByPassword(id, deletePassword);
      setDeletingId(null);
      setDeletePassword('');
      load();
    } catch {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div style={{ background: 'var(--page-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">

        <div className="mb-12">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Guestbook
          </span>
          <h1 className="text-4xl font-bold mt-3 mb-2">방명록</h1>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
            방문해주셔서 감사합니다. 한 마디 남겨주세요 :)
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 mb-10 space-y-4"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div className="flex gap-3">
            <StyledInput
              type="text"
              placeholder="이름 *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={20}
              style={{ flex: 1 }}
            />
            <StyledInput
              type="password"
              placeholder="비밀번호 *"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              style={{ flex: 1 }}
            />
          </div>
          <textarea
            placeholder="메시지를 남겨주세요 *"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            maxLength={500}
            rows={3}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-colors"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-hi)',
            }}
          />
          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-2 text-sm cursor-pointer select-none"
              style={{ color: 'var(--text-low)' }}
            >
              <input
                type="checkbox"
                checked={form.secret}
                onChange={(e) => setForm((f) => ({ ...f, secret: e.target.checked }))}
                className="accent-indigo-500"
              />
              <Lock size={13} /> 비밀글
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-85 disabled:opacity-40 active:scale-95"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>

        {/* Entries */}
        {loading ? (
          <Spinner className="py-12" />
        ) : entries.length === 0 ? (
          <p className="text-center py-12" style={{ color: 'var(--text-faint)' }}>
            아직 방명록이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl p-5"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{entry.name}</span>
                    {entry.secret && (
                      <span
                        className="inline-flex items-center gap-0.5 text-xs"
                        style={{ color: 'var(--accent)' }}
                      >
                        <Lock size={10} /> 비밀글
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <button
                      onClick={() => { setDeletingId(entry.id); setDeletePassword(''); }}
                      className="transition-colors hover:text-red-400"
                      style={{ color: 'var(--text-xfaint)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    entry.secret && entry.message === '비밀글입니다.' ? 'italic' : ''
                  }`}
                  style={{
                    color: entry.secret && entry.message === '비밀글입니다.'
                      ? 'var(--text-faint)'
                      : 'var(--text-med)',
                  }}
                >
                  {entry.message}
                </p>

                {deletingId === entry.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="password"
                      placeholder="비밀번호 입력"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleDelete(entry.id)}
                      className="flex-1 rounded-xl px-3 py-1.5 text-sm outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-hi)',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-3 py-1.5 text-white text-xs rounded-xl transition-colors hover:bg-red-500"
                      style={{ background: 'rgba(239,68,68,0.75)' }}
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1.5 text-xs rounded-xl transition-colors"
                      style={{
                        background: 'var(--card-bg-2)',
                        color: 'var(--text-med)',
                      }}
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
