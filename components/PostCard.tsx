'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, ArrowRight } from 'lucide-react';

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

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="group h-full">
      <Card className="h-full overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          {post.featured_media_url && (
            <div className="relative w-full h-48 overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={post.featured_media_url}
                  alt={post.title.rendered}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div>
                  <div className="p-3 bg-white/90 rounded-full">
                    <ArrowRight className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-4">
            {post.category_names && post.category_names.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.category_names.slice(0, 2).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-black transition-colors">
                {post.title.rendered}
              </h3>
              
              <div 
                className="text-gray-600 text-sm line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                
                {post.author_name && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author_name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div>
            <Button 
              asChild 
              variant="outline"
              className="group/btn w-full border border-gray-300 hover:border-gray-900 transition-all duration-200"
            >
              <Link href={`/posts/${post.slug}`} className="flex items-center justify-center space-x-2">
                <span className="font-medium">Read More</span>
                <div>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </div>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 