'use client';

import PostCard from './PostCard';
import { FileText } from 'lucide-react';

interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  featured_media_url?: string;
  date: string;
  author: number;
  author_name?: string;
  slug: string;
  categories: number[];
  category_names?: string[];
}

interface PostListProps {
  posts: Post[];
  title?: string;
}

export default function PostList({ posts, title }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <div>
            <FileText className="h-12 w-12 text-blue-400" />
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find any blog posts at the moment. Please check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
} 