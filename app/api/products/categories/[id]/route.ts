import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from 'woocommerce-rest-ts-api';

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await api.get(`products/categories/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching product category:', error);
    return NextResponse.json({ error: 'Product category not found' }, { status: 404 });
  }
} 