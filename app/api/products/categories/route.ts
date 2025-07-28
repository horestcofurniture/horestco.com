export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceClient } from '../../../../lib/woocommerce-client';
import { proxyImageUrl } from '../../../../lib/utils';

export async function GET(request: NextRequest) {
  try {
    const wooCommerceClient = createWooCommerceClient();
    const response = await wooCommerceClient.get('products/categories', { per_page: 100 });
    
    // Proxy image URLs for categories if they have images
    const categories = Array.isArray(response.data) ? response.data : [];
    const proxiedCategories = categories.map(category => ({
      ...category,
      image: category.image ? {
        ...category.image,
        src: proxyImageUrl(category.image.src),
        srcset: category.image.srcset ? proxyImageUrl(category.image.srcset) : undefined,
      } : null,
    }));
    
    return NextResponse.json(proxiedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 500 });
  }
} 