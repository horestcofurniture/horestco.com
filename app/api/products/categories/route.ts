export const runtime = 'edge';

import { NextResponse } from 'next/server';
import WooCommerceRestApi from 'woocommerce-rest-ts-api';

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true,
});

export async function GET() {
  try {
    const response = await api.get('products/categories', { per_page: 100 });
    return NextResponse.json(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return NextResponse.json([], { status: 500 });
  }
} 