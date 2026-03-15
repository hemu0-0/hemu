import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { login } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login({ password });
      setToken(token);
      navigate('/admin/dashboard');
    } catch {
      setError('비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Lock size={22} className="text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">관리자 로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
}
