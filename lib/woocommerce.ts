// Client-side functions that call our internal API routes
import { 
  WooCommerceProduct, 
  WooCommerceProductCategory,
  WooCommerceProductQueryParams 
} from './woocommerce-types';
import { proxyProductImages } from './utils';

// Helper function to construct API URLs consistently
function getAPIUrl(endpoint: string): string {
  if (typeof window === 'undefined') {
    // Server-side: need absolute URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return `${baseUrl}/api${endpoint}`;
  } else {
    // Client-side: can use relative URL
    return `/api${endpoint}`;
  }
}

// Products API functions (now calling internal API routes)
export async function getProducts(params?: WooCommerceProductQueryParams): Promise<WooCommerceProduct[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    
    const url = getAPIUrl(`/products?${searchParams.toString()}`);
    console.log('Making request to', url); // Debug log
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: number): Promise<WooCommerceProduct> {
  try {
    const url = getAPIUrl(`/products/${id}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}

export async function getProductBySlug(slug: string): Promise<WooCommerceProduct[]> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('slug', slug);
    
    const url = getAPIUrl(`/products?${searchParams.toString()}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // Note: The API route already proxies the images, so we don't need to do it again here
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw new Error(`Failed to fetch product with slug ${slug}`);
  }
}

export async function getProductCategories(): Promise<WooCommerceProductCategory[]> {
  try {
    const url = getAPIUrl('/products/categories');
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw new Error('Failed to fetch product categories');
  }
}

export async function getProductCategory(id: number): Promise<WooCommerceProductCategory> {
  try {
    const url = getAPIUrl(`/products/categories/${id}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product category:', error);
    throw new Error(`Failed to fetch product category ${id}`);
  }
}

export async function getCategoryWithImage(categoryId: number): Promise<any> {
  try {
    const url = getAPIUrl(`/categories/${categoryId}/image`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Category ${categoryId} image not found or error: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching category with image:', error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<WooCommerceProductCategory | null> {
  try {
    const categories = await getProductCategories();
    return categories.find(cat => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error finding category by slug:', error);
    return null;
  }
}

// Helper functions (unchanged)
export function formatPrice(price: string | number, currency: string = 'MYR'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
  }).format(numPrice);
}

export function getProductMainImage(product: WooCommerceProduct): string | null {
  if (product.images && product.images.length > 0) {
    return product.images[0].src;
  }
  return null;
}

export function stripHtmlFromDescription(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function getProductExcerpt(product: WooCommerceProduct, maxLength: number = 150): string {
  let text = '';
  
  if (product.short_description) {
    text = stripHtmlFromDescription(product.short_description);
  } else if (product.description) {
    text = stripHtmlFromDescription(product.description);
  }
  
  if (text.length > maxLength) {
    return text.substring(0, maxLength).trim() + '...';
  }
  
  return text;
}

export function isProductOnSale(product: WooCommerceProduct): boolean {
  return product.on_sale && parseFloat(product.sale_price) > 0;
}

export function getDiscountPercentage(product: WooCommerceProduct): number {
  if (!isProductOnSale(product)) return 0;
  
  const regular = parseFloat(product.regular_price);
  const sale = parseFloat(product.sale_price);
  
  if (regular > 0 && sale < regular) {
    return Math.round(((regular - sale) / regular) * 100);
  }
  
  return 0;
} 