'use client';

import ProductCard from './ProductCard';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import { Package } from 'lucide-react';

interface ProductListProps {
  products: WooCommerceProduct[];
  title?: string;
}

export default function ProductList({ products, title }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <div>
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find any products at the moment. Please check back later or contact us for assistance.
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
} 