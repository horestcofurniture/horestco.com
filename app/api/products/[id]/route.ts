export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceClient } from '../../../../lib/woocommerce-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await wooCommerceClient.get(`products/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
} 