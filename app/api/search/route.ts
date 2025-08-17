export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Search query must be at least 2 characters long' 
      }, { status: 400 });
    }

    console.log(`Searching for: "${query}" (page ${page}, ${perPage} per page)`);

    // Search products using WooCommerce API
    const products = await getProducts({
      search: query.trim(),
      page: page,
      per_page: perPage,
      status: 'publish'
    });

    // Get total count for pagination (WooCommerce API should return this in headers)
    const totalResults = Array.isArray(products) ? products.length : 0;

    return NextResponse.json({
      products: Array.isArray(products) ? products : [],
      query: query.trim(),
      page: page,
      per_page: perPage,
      total_results: totalResults,
      has_more: totalResults === perPage // Simple check, could be improved
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Search failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
