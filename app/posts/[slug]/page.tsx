import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getPostBySlug, getFeaturedImage, stripHtml } from '@/lib/wordpress';
import { WordPressPost } from '@/lib/types';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  let post: WordPressPost;
  
  try {
    const posts = await getPostBySlug(slug);
    if (!posts || posts.length === 0) {
      notFound();
    }
    post = posts[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  const featuredImage = await getFeaturedImage(post);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article>
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {stripHtml(post.title.rendered)}
          </h1>
          
          <div className="text-gray-600 mb-6">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM dd, yyyy')}
            </time>
          </div>

          {featuredImage && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || stripHtml(post.title.rendered)}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}
        </header>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps) {
  try {
    const { slug } = await params;
    const posts = await getPostBySlug(slug);
    if (!posts || posts.length === 0) {
      return {
        title: 'Post Not Found',
      };
    }
    
    const post = posts[0];
    const title = stripHtml(post.title.rendered);
    const description = post.excerpt.rendered 
      ? stripHtml(post.excerpt.rendered).substring(0, 160)
      : stripHtml(post.content.rendered).substring(0, 160);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
} 