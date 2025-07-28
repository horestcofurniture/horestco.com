export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceClient } from '../../../../../lib/woocommerce-client';
import { proxyImageUrl } from '../../../../../lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const wooCommerceClient = createWooCommerceClient();
    const { id } = await params;
    
    const response = await wooCommerceClient.get(`products/categories/${id}`);
    
    // Proxy image URLs for category if it has an image
    const category = response.data;
    const proxiedCategory = {
      ...category,
      image: category.image ? {
        ...category.image,
        src: proxyImageUrl(category.image.src),
        srcset: category.image.srcset ? proxyImageUrl(category.image.srcset) : undefined,
      } : null,
    };
    
    return NextResponse.json(proxiedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
} 