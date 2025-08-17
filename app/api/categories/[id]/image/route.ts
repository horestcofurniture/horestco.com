export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get WordPress site URL from environment
    const wpSiteUrl = process.env.WORDPRESS_SITE_URL;
    if (!wpSiteUrl) {
      console.error('WORDPRESS_SITE_URL environment variable not set');
      return NextResponse.json({ error: 'WordPress site URL not configured' }, { status: 500 });
    }

    // Fetch category with embedded featured media
    const wpApiUrl = `${wpSiteUrl}/wp-json/wp/v2/product_cat/${id}?_embed`;
    console.log('Fetching category image from:', wpApiUrl);
    
    const response = await fetch(wpApiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Horestco-NextJS-App'
      }
    });

    if (!response.ok) {
      console.error(`WordPress API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryData = await response.json();
    
    // Debug: Log the response structure
    console.log(`Category ${id} response:`, JSON.stringify({
      name: categoryData.name,
      slug: categoryData.slug,
      hasEmbedded: !!categoryData._embedded,
      embeddedKeys: categoryData._embedded ? Object.keys(categoryData._embedded) : [],
      featuredMediaExists: !!(categoryData._embedded && categoryData._embedded['wp:featuredmedia']),
      featuredMediaLength: categoryData._embedded && categoryData._embedded['wp:featuredmedia'] ? categoryData._embedded['wp:featuredmedia'].length : 0
    }, null, 2));
    
    // Extract featured image from embedded data
    let featuredImage = null;
    if (categoryData._embedded && categoryData._embedded['wp:featuredmedia']) {
      const media = categoryData._embedded['wp:featuredmedia'][0];
      console.log(`Category ${id} media object:`, JSON.stringify({
        hasSourceUrl: !!media.source_url,
        sourceUrl: media.source_url,
        altText: media.alt_text,
        mediaDetails: media.media_details ? 'exists' : 'missing'
      }, null, 2));
      
      if (media && media.source_url) {
        featuredImage = {
          url: media.source_url,
          alt: media.alt_text || categoryData.name || '',
          width: media.media_details?.width || null,
          height: media.media_details?.height || null
        };
      }
    } else {
      console.log(`Category ${id} has no featured media in _embedded`);
    }

    return NextResponse.json({
      id: categoryData.id,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      count: categoryData.count,
      featured_image: featuredImage
    });

  } catch (error) {
    console.error('Error fetching category image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
