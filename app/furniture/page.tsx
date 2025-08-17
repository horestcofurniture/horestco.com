'use client';

import { getProducts } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductGrid from '@/components/ProductGrid';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Filter, Grid, TrendingUp, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';

export default function FurniturePage() {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const newProducts = await getProducts({
        page: pageNum,
        per_page: 20,
        status: 'publish',
        stock_status: 'instock'
      });

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setHasMore(newProducts.length === 20);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial products
  useEffect(() => {
    loadProducts(1, true);
  }, [loadProducts]);

  // Infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage);
      }
    }, { threshold: 1 });
    if (triggerRef.current) {
      observerRef.current.observe(triggerRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, loadProducts]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-white text-black border-b border-gray-100">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <Badge className="px-6 py-3 bg-gray-100 text-black border-gray-300 text-lg">
              <Package className="w-5 h-5 mr-2" />
              Our Furniture Collection
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Premium <span className="text-gray-700">Furniture</span>
              <span className="block">for Every Home</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of high-quality furniture pieces 
              designed to transform your living and working spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <Grid className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {products.length} Products
                </span>
              </div>
              
              {!loading && !error && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Updated Daily</span>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter & Sort</span>
            </Button>
          </div>

          {/* Products Grid */}
          <ProductGrid 
            products={products}
            loading={loading}
            error={error}
            gridCols="4"
            className="mt-10"
          />

          {/* Load More Button */}
          {!hasMore && products.length > 0 && !loading && (
            <div className="text-center py-12 mt-8">
              <p className="text-gray-600 text-lg">
                You've seen all our amazing furniture pieces!
              </p>
            </div>
          )}

          {/* Loading More */}
          {loading && page > 1 && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto" />
              <p className="text-gray-600 mt-2">Loading more products...</p>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div ref={triggerRef} id="infinite-scroll-trigger" className="h-8"></div>
        </div>
      </section>
    </div>
  );
} 