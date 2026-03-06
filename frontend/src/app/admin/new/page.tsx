'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default function NewPostPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/admin');
    else setAuthed(true);
  }, [router]);

  if (!authed) return null;
  return <PostEditor />;
}
