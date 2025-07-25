'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowRight, BookOpen, User } from 'lucide-react';
import { WordPressPost } from '@/lib/types';
import { getExcerpt, stripHtml } from '@/lib/wordpress';

interface PostCardProps {
  post: WordPressPost;
  featuredImage?: {
    source_url: string;
    alt_text: string;
    media_details: {
      width: number;
      height: number;
    };
  } | null;
  index?: number;
}

export default function PostCard({ post, featuredImage, index = 0 }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:bg-white">
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Link href={`/posts/${post.slug}`} className="block">
              <div className="relative w-full h-48 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={featuredImage.source_url}
                    alt={featuredImage.alt_text || stripHtml(post.title.rendered)}
                    fill
                    className="object-cover transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
                
                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  initial={false}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button size="sm" variant="secondary" className="rounded-full p-3 bg-white/90 backdrop-blur-sm">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </Link>
          </div>
        )}
        
        <CardHeader className="pb-4">
          {/* Post Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
            
            {post.sticky && (
              <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Post Title */}
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
              {stripHtml(post.title.rendered)}
            </h2>
          </Link>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4">
          {/* Post Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.categories.slice(0, 2).map((categoryId) => (
                <Badge 
                  key={categoryId}
                  variant="outline" 
                  className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  Category
                </Badge>
              ))}
            </div>
          )}
          
          {/* Post Excerpt */}
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {getExcerpt(post, 150)}
          </p>
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            {/* Author Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-700">Author</p>
                <p className="text-xs text-gray-500">Content Creator</p>
              </div>
            </div>
            
            {/* Read More Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild
                variant="ghost" 
                size="sm"
                className="group text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Link href={`/posts/${post.slug}`} className="flex items-center space-x-1">
                  <span className="font-medium">Read More</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 