'use client';

import ProductCard from './ProductCard';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import { Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  products: WooCommerceProduct[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
  loading?: boolean;
  error?: string | null;
  className?: string;
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
}

export default function ProductGrid({ 
  products, 
  title, 
  subtitle,
  maxItems,
  showViewAll = false,
  viewAllHref = '/furniture',
  viewAllText = 'View All Products',
  loading = false,
  error = null,
  className = '',
  gridCols = '4'
}: ProductGridProps) {
  // Determine grid columns based on prop
  const getGridCols = () => {
    const colsMap = {
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 md:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      '5': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      '6': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    return colsMap[gridCols] || colsMap['4'];
  };

  // Filter products if maxItems is specified
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        {title && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className={`grid ${getGridCols()} gap-6`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group h-full">
              <div className="h-full overflow-hidden border border-gray-100 rounded-lg">
                <div className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <div className="animate-pulse w-full h-full bg-gray-200" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>
                    <div className="h-px bg-gray-200 w-full" />
                    <div className="flex items-center justify-between">
                      <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3" />
                      <div className="flex items-center space-x-1">
                        <div className="animate-pulse h-4 w-4 bg-gray-200 rounded-full" />
                        <div className="animate-pulse h-4 bg-gray-200 rounded w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Package className="h-12 w-12 text-red-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          {error}
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-black text-white hover:bg-gray-800"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find any products at the moment. Please check back later or contact us for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Products Grid */}
      <div className={`grid ${getGridCols()} gap-6`}>
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      {showViewAll && products.length > 0 && (
        <div className="text-center pt-8">
          <Button 
            asChild 
            size="lg" 
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl"
          >
            <a href={viewAllHref} className="flex items-center space-x-3">
              <Package className="w-5 h-5" />
              <span>{viewAllText}</span>
            </a>
          </Button>
        </div>
      )}
    </div>
  );
} 