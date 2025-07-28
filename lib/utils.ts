import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transforms a WooCommerce image URL to use our proxy API route
 * This helps avoid CORS issues when loading images from WooCommerce
 */
export function proxyImageUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  
  try {
    // If the URL is already a proxy URL, return as is
    if (originalUrl.includes('/api/proxy/image')) {
      return originalUrl;
    }
    
    // Encode the original URL and create proxy URL
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/proxy/image?url=${encodedUrl}`;
  } catch (error) {
    console.error('Error creating proxy URL:', error);
    return originalUrl; // Fallback to original URL
  }
}

/**
 * Transforms all image URLs in a WooCommerce product to use our proxy
 */
export function proxyProductImages(product: any): any {
  if (!product) return product;
  
  // Create a copy to avoid mutating the original
  const proxiedProduct = { ...product };
  
  // Transform main images array
  if (proxiedProduct.images && Array.isArray(proxiedProduct.images)) {
    proxiedProduct.images = proxiedProduct.images.map((image: any) => ({
      ...image,
      src: proxyImageUrl(image.src),
      srcset: image.srcset ? proxyImageUrl(image.srcset) : undefined,
    }));
  }
  
  return proxiedProduct;
}
