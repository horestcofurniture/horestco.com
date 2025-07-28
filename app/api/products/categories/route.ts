export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { wooCommerceClient } from '../../../../lib/woocommerce-client';

export async function GET() {
  try {
    const response = await wooCommerceClient.get('products/categories', { per_page: 100 });
    return NextResponse.json(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return NextResponse.json([], { status: 500 });
  }
} 