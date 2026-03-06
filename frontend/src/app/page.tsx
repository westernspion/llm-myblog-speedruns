import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import { getPosts } from '@/lib/api';

async function HomePage() {
  let posts = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      next: { revalidate: 60 }
    });
    posts = await response.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="mb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-glow-pink">
            Bradley Savoy
          </h1>
          <p className="text-xl md:text-2xl text-synthwave-text-secondary mb-4">
            DevOps & SRE Engineer • 15+ Years Experience
          </p>
          <p className="text-lg text-synthwave-text-secondary max-w-2xl mx-auto">
            Exploring infrastructure automation, cloud platforms, and modern operational excellence.
          </p>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-10 text-synthwave-neon-cyan">Latest Articles</h2>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.slice(0, 6).map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-synthwave-text-secondary text-lg">No articles published yet.</p>
          </div>
        )}
      </section>

      <section className="py-16 border-t border-synthwave-text-secondary border-opacity-20">
        <h2 className="text-3xl font-bold mb-8 text-synthwave-neon-purple">About This Site</h2>
        <div className="card">
          <p className="mb-4">
            This blog is built with modern DevOps best practices in mind. Everything runs in Docker containers,
            orchestrated via Docker Compose for easy local development and deployment.
          </p>
          <p className="mb-4">
            The frontend is powered by Next.js with a synthwave-inspired design aesthetic, while the backend
            provides a RESTful API for managing blog content. PostgreSQL handles all data persistence.
          </p>
          <p>
            The entire application can be exposed to the internet using Cloudflare Tunnel for secure, zero-trust access.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
