export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceClient } from '../../../lib/woocommerce-client';
import { proxyProductImages } from '../../../lib/utils';

export async function GET(request: NextRequest) {
  try {
    const wooCommerceClient = createWooCommerceClient();
    
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get('per_page') || '10';
    const status = searchParams.get('status') || 'publish';
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const params: any = {
      per_page: parseInt(per_page),
      status,
      page: parseInt(page),
    };
    
    if (featured === 'true') {
      params.featured = true;
    }
    
    if (slug) {
      params.slug = slug;
    }
    
    if (category) {
      params.category = category;
    }
    
    if (search) {
      params.search = search;
    }
    
    const response = await wooCommerceClient.get('products', params);
    
    // Proxy image URLs to avoid CORS issues
    const products = Array.isArray(response.data) ? response.data : [];
    const proxiedProducts = products.map(product => proxyProductImages(product));
    
    return NextResponse.json(proxiedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 500 });
  }
} 