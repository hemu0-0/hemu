import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Home from '../pages/Home';
import Blog from '../pages/Blog';
import BlogDetail from '../pages/BlogDetail';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import About from '../pages/About';
import Guestbook from '../pages/Guestbook';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PostEditor from '../pages/admin/PostEditor';
import ProjectEditor from '../pages/admin/ProjectEditor';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return isAdmin ? <>{children}</> : <Navigate to="/admin" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
      />
      <Route
        path="/admin/posts/new"
        element={<PrivateRoute><PostEditor /></PrivateRoute>}
      />
      <Route
        path="/admin/posts/:id/edit"
        element={<PrivateRoute><PostEditor /></PrivateRoute>}
      />
      <Route
        path="/admin/projects/new"
        element={<PrivateRoute><ProjectEditor /></PrivateRoute>}
      />
      <Route
        path="/admin/projects/:id/edit"
        element={<PrivateRoute><ProjectEditor /></PrivateRoute>}
      />
    </Routes>
  );
}
