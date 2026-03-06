'use client';

import { useState, useEffect } from 'react';
import { login, getAllPosts, deletePost, Post } from '@/lib/api';
import Link from 'next/link';

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      onLogin(token);
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="synth-card p-8">
        <p className="font-mono text-synth-cyan text-sm mb-6 text-glow-cyan">$ sudo -i</p>
        <h1 className="text-2xl font-bold text-synth-text-primary mb-8">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-synth-text-muted block mb-2">email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="synth-input"
              placeholder="brad.savoy@gmail.com"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs text-synth-text-muted block mb-2">password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="synth-input"
              required
            />
          </div>
          {error && (
            <p className="font-mono text-xs text-synth-pink">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'authenticating...' : 'login'}
          </button>
        </form>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchPosts() {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete post');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-synth-cyan text-sm mb-1">$ cd /admin</p>
          <h1 className="text-3xl font-bold text-synth-text-primary">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/new" className="btn-primary">+ new post</Link>
          <button onClick={onLogout} className="btn-ghost">logout</button>
        </div>
      </div>

      {loading && (
        <div className="font-mono text-synth-text-muted text-sm">loading...</div>
      )}
      {error && (
        <div className="font-mono text-synth-pink text-sm">{error}</div>
      )}
      {!loading && !error && (
        <div className="space-y-3">
          {posts.length === 0 && (
            <div className="text-center py-16 text-synth-text-muted font-mono text-sm">
              No posts yet. Create your first one.
            </div>
          )}
          {posts.map((post) => (
            <div key={post.id} className="synth-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                    post.published
                      ? 'bg-synth-green/10 text-synth-green border border-synth-green/20'
                      : 'bg-synth-text-muted/10 text-synth-text-muted border border-synth-border'
                  }`}>
                    {post.published ? 'published' : 'draft'}
                  </span>
                  <span className="font-mono text-xs text-synth-text-muted/50">
                    {formatDate(post.updatedAt)}
                  </span>
                </div>
                <p className="text-synth-text-primary font-medium truncate">{post.title}</p>
                <div className="flex gap-2 mt-1">
                  {post.tags.map(t => (
                    <span key={t.slug} className="synth-tag text-xs">{t.name}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="btn-ghost text-xs py-1.5 px-3"
                >
                  edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="btn-danger"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
    setChecked(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  if (!checked) return null;
  if (!token) return <LoginForm onLogin={setToken} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
