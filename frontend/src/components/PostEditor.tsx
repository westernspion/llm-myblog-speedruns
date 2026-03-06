'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, Post } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  post?: Post;
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState(post?.tags.map(t => t.name).join(', ') ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError('Title, excerpt, and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      if (post) {
        await updatePost(post.id, { title, excerpt, content, published, tagNames });
      } else {
        await createPost({ title, excerpt, content, published, tagNames });
      }
      router.push('/admin');
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push('/admin')}
            className="font-mono text-xs text-synth-text-muted hover:text-synth-cyan transition-colors mb-2 block"
          >
            ← back
          </button>
          <h1 className="text-2xl font-bold text-synth-text-primary">
            {post ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="btn-ghost"
          >
            {preview ? 'editor' : 'preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'saving...' : published ? 'save & publish' : 'save draft'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 font-mono text-xs text-synth-pink border border-synth-pink/20 bg-synth-pink/5 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="font-mono text-xs text-synth-text-muted block mb-2">title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="synth-input text-lg font-semibold"
            placeholder="Post title..."
          />
        </div>

        <div>
          <label className="font-mono text-xs text-synth-text-muted block mb-2">excerpt</label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className="synth-input resize-none h-20"
            placeholder="Short summary shown in post listings..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-synth-text-muted block mb-2">tags (comma separated)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="synth-input"
              placeholder="kubernetes, devops, sre"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setPublished(!published)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  published ? 'bg-synth-cyan' : 'bg-synth-border'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-synth-bg transition-transform ${
                  published ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
              <span className="font-mono text-sm text-synth-text-muted">
                {published ? 'published' : 'draft'}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-synth-text-muted block mb-2">
            content (markdown)
          </label>
          {preview ? (
            <div className="synth-card p-8 min-h-[500px]">
              <div className="prose-synthwave">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="synth-input resize-y font-mono text-sm leading-relaxed"
              style={{ minHeight: '500px' }}
              placeholder="# Your post title&#10;&#10;Write your content in markdown..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
