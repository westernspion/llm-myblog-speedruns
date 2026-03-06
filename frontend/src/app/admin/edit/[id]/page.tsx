'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllPosts, Post } from '@/lib/api';
import PostEditor from '@/components/PostEditor';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin'); return; }

    getAllPosts()
      .then(posts => {
        const found = posts.find(p => p.id === parseInt(params.id));
        if (!found) router.push('/admin');
        else setPost(found);
      })
      .catch(() => router.push('/admin'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-mono text-synth-text-muted text-sm">
      loading...
    </div>
  );
  if (!post) return null;
  return <PostEditor post={post} />;
}
