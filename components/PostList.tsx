'use client';

import { motion } from 'framer-motion';
import { WordPressPost, WordPressMedia } from '@/lib/types';
import { getFeaturedImage } from '@/lib/wordpress';
import PostCard from './PostCard';
import { BookOpen } from 'lucide-react';

interface PostListProps {
  posts: WordPressPost[];
}

interface PostWithImage {
  post: WordPressPost;
  featuredImage: WordPressMedia | null;
}

export default async function PostList({ posts }: PostListProps) {
  // Fetch featured images for all posts
  const postsWithImages: PostWithImage[] = await Promise.all(
    posts.map(async (post) => ({
      post,
      featuredImage: await getFeaturedImage(post),
    }))
  );

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-12 h-12 text-blue-600" />
          </motion.div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No posts found</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Check back later for new content and exciting updates!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {postsWithImages.map(({ post, featuredImage }, index) => (
        <PostCard 
          key={post.id} 
          post={post} 
          featuredImage={featuredImage}
          index={index}
        />
      ))}
    </motion.div>
  );
} 