export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceClient } from '../../../../lib/woocommerce-client';
import { proxyProductImages } from '../../../../lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const wooCommerceClient = createWooCommerceClient();
    const { id } = await params;
    
    const response = await wooCommerceClient.get(`products/${id}`);
    
    // Proxy image URLs to avoid CORS issues
    const proxiedProduct = proxyProductImages(response.data);
    
    return NextResponse.json(proxiedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
} 