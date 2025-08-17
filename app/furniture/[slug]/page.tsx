export const runtime = 'edge';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, stripHtmlFromDescription } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce-types';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: WooCommerceProduct;
  
  try {
    const products = await getProductBySlug(slug);
    if (!products || products.length === 0) {
      notFound();
    }
    product = products[0];
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

            </div>
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <svg 
                className="w-24 h-24 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
          
          {/* Additional images thumbnail */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image) => (
                <div key={image.id} className="relative aspect-square rounded overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {/* Product categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories.map((category) => (
                  <span 
                    key={category.id}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
            

          </div>



          {/* Product Info */}
          <div className="space-y-4">
            {product.sku && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
            )}
            
            {/* Short Description */}
            {product.short_description && (
              <div className="prose max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-black hover:prose-a:text-gray-800"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const products = await getProductBySlug(slug);
    if (!products || products.length === 0) {
      return {
        title: 'Product Not Found',
      };
    }
    
    const product = products[0];
    const description = product.short_description 
      ? stripHtmlFromDescription(product.short_description).substring(0, 160)
      : stripHtmlFromDescription(product.description).substring(0, 160);

    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        images: product.images?.map(img => ({
          url: img.src,
          alt: img.alt || product.name
        })) || [],
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
    };
  }
} 