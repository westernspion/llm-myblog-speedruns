'use client';

import { useState } from 'react';
import { login } from '@/lib/api';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email, password);
      setToken(response.token);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="card">
            <h1 className="text-3xl font-bold mb-8 neon-glow-cyan">Admin Login</h1>

            {error && (
              <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-synthwave-bg border border-synthwave-text-secondary border-opacity-30 rounded-lg focus:outline-none focus:border-synthwave-neon-cyan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-synthwave-bg border border-synthwave-text-secondary border-opacity-30 rounded-lg focus:outline-none focus:border-synthwave-neon-cyan"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold neon-glow-cyan">Admin Dashboard</h1>
        <button
          onClick={() => {
            setIsLoggedIn(false);
            setToken('');
          }}
          className="btn btn-outline"
        >
          Logout
        </button>
      </div>

      <p className="text-synthwave-text-secondary mb-8">
        Welcome to the admin dashboard. Token: {token.substring(0, 20)}...
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-synthwave-neon-pink mb-4">Posts</h2>
          <p className="text-synthwave-text-secondary mb-4">Manage your blog posts</p>
          <button className="btn btn-primary">View Posts</button>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-synthwave-neon-cyan mb-4">Tags</h2>
          <p className="text-synthwave-text-secondary mb-4">Manage article tags</p>
          <button className="btn btn-secondary">View Tags</button>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-synthwave-neon-purple mb-4">Analytics</h2>
          <p className="text-synthwave-text-secondary mb-4">View blog statistics</p>
          <button className="btn btn-outline">View Stats</button>
        </div>
      </div>
    </div>
  );
}
