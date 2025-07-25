// Client-side functions that call our internal API routes
import { 
  WooCommerceProduct, 
  WooCommerceProductCategory,
  WooCommerceProductQueryParams 
} from './woocommerce-types';

// Products API functions (now calling internal API routes)
export async function getProducts(params?: WooCommerceProductQueryParams): Promise<WooCommerceProduct[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.page) searchParams.set('page', params.page.toString());
    
    console.log('Client: Making request to', `/api/products?${searchParams.toString()}`); // Debug log
    
    const response = await fetch(`/api/products?${searchParams.toString()}`);
    
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
    const response = await fetch(`/api/products/${id}`);
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
    const response = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw new Error(`Failed to fetch product with slug ${slug}`);
  }
}

export async function getProductCategories(): Promise<WooCommerceProductCategory[]> {
  try {
    const response = await fetch('/api/products/categories');
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
    const response = await fetch(`/api/products/categories/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product category:', error);
    throw new Error(`Failed to fetch product category ${id}`);
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