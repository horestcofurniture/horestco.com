import { WordPressPost, WordPressPage, WordPressMedia, WordPressCategory, WordPressTag, WordPressQueryParams } from './types';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not defined');
}

// Helper function to build query string from parameters
function buildQueryString(params: WordPressQueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

// Generic fetch function with error handling
async function fetchFromWordPress<T>(endpoint: string, params?: WordPressQueryParams): Promise<T> {
  const queryString = params ? buildQueryString(params) : '';
  const url = `${API_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable caching for better performance
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from WordPress API (${url}):`, error);
    throw error;
  }
}

// Posts API functions
export async function getPosts(params?: WordPressQueryParams): Promise<WordPressPost[]> {
  return fetchFromWordPress<WordPressPost[]>('posts', params);
}

export async function getPost(id: number): Promise<WordPressPost> {
  return fetchFromWordPress<WordPressPost>(`posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<WordPressPost[]> {
  return fetchFromWordPress<WordPressPost[]>('posts', { slug: [slug] });
}

// Pages API functions
export async function getPages(params?: WordPressQueryParams): Promise<WordPressPage[]> {
  return fetchFromWordPress<WordPressPage[]>('pages', params);
}

export async function getPage(id: number): Promise<WordPressPage> {
  return fetchFromWordPress<WordPressPage>(`pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<WordPressPage[]> {
  return fetchFromWordPress<WordPressPage[]>('pages', { slug: [slug] });
}

// Media API functions
export async function getMedia(id: number): Promise<WordPressMedia> {
  return fetchFromWordPress<WordPressMedia>(`media/${id}`);
}

export async function getAllMedia(params?: WordPressQueryParams): Promise<WordPressMedia[]> {
  return fetchFromWordPress<WordPressMedia[]>('media', params);
}

// Categories API functions
export async function getCategories(params?: WordPressQueryParams): Promise<WordPressCategory[]> {
  return fetchFromWordPress<WordPressCategory[]>('categories', params);
}

export async function getCategory(id: number): Promise<WordPressCategory> {
  return fetchFromWordPress<WordPressCategory>(`categories/${id}`);
}

// Tags API functions
export async function getTags(params?: WordPressQueryParams): Promise<WordPressTag[]> {
  return fetchFromWordPress<WordPressTag[]>('tags', params);
}

export async function getTag(id: number): Promise<WordPressTag> {
  return fetchFromWordPress<WordPressTag>(`tags/${id}`);
}

// Helper function to get featured image
export async function getFeaturedImage(post: WordPressPost | WordPressPage): Promise<WordPressMedia | null> {
  if (!post.featured_media) return null;
  
  try {
    return await getMedia(post.featured_media);
  } catch (error) {
    console.error('Error fetching featured image:', error);
    return null;
  }
}

// Helper function to strip HTML tags from content
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Helper function to get excerpt with fallback
export function getExcerpt(post: WordPressPost | WordPressPage, maxLength: number = 150): string {
  // First try to use the excerpt
  if (post.excerpt.rendered) {
    const strippedExcerpt = stripHtml(post.excerpt.rendered);
    if (strippedExcerpt.length > 0) {
      return strippedExcerpt.length > maxLength 
        ? strippedExcerpt.substring(0, maxLength) + '...'
        : strippedExcerpt;
    }
  }
  
  // Fallback to content
  const strippedContent = stripHtml(post.content.rendered);
  return strippedContent.length > maxLength 
    ? strippedContent.substring(0, maxLength) + '...'
    : strippedContent;
} 