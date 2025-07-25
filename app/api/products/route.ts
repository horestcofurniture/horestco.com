import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from 'woocommerce-rest-ts-api';

// Initialize WooCommerce API client (server-side only)
const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get('per_page') || '10';
    const status = searchParams.get('status') || 'publish';
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const page = searchParams.get('page') || '1';
    
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
    
    console.log('API Request params:', params); // Debug log
    
    const response = await api.get('products', params);
    
    return NextResponse.json(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 500 });
  }
} 