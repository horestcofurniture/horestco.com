'use client';

import { getProducts } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Filter, Grid, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async (pageNum: number) => {
    try {
      const fetchedProducts = await getProducts({ 
        per_page: 20, 
        status: 'publish',
        page: pageNum
      });
      
      const productsArray = Array.isArray(fetchedProducts) ? fetchedProducts : [];
      
      if (productsArray.length === 0 || productsArray.length < 20) {
        setHasMore(false);
      }
      
      if (pageNum === 1) {
        setProducts(productsArray);
      } else {
        setProducts(prev => {
          // Filter out any products that already exist to prevent duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = productsArray.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    }
  }, []);

  // Load initial products
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await loadProducts(1);
      setLoading(false);
    };
    loadInitial();
  }, [loadProducts]);
  
  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 1000) {
        if (!loadingMore && hasMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          loadProducts(nextPage).finally(() => setLoadingMore(false));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, page, loadProducts]);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Badge className="px-6 py-3 bg-gray-100 text-black border-gray-300 text-lg">
              <Package className="w-5 h-5 mr-2" />
              Our Collection
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">
              Our
              <span className="block text-black">
                Products
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of premium furniture designed to transform your living space with unmatched style and comfort.
            </p>

            <Separator className="w-24 mx-auto bg-black h-1 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between mb-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <Grid className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {loading ? 'Loading...' : `${products.length} Products`}
                </span>
              </div>
              {products.length > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  In Stock
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100">
                <span>Sort</span>
              </Button>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Sparkles className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  Unable to load products
                </h3>
                <p className="text-red-700 text-lg">
                  Please check your WooCommerce configuration. Error: {error}
                </p>
              </div>
            </motion.div>
          )}



          {/* Initial Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border-0">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                      <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                      <div className="bg-gray-200 h-8 rounded w-full"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
          )}

          {/* End of Results */}
          {!hasMore && products.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 mt-8"
            >
              <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  You've seen it all!
                </h3>
                <p className="text-gray-600">
                  You've viewed all {products.length} products in our collection.
                </p>
              </div>
            </motion.div>
          )}

          {/* Results Summary */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <div className="flex items-center justify-center mb-4">
                <Badge className="px-4 py-2 bg-black text-white">
                  <Package className="w-4 h-4 mr-2" />
                  Showing Results
                </Badge>
              </div>
              <p className="text-lg text-gray-700 font-medium">
                Displaying <span className="font-bold text-black">{products.length}</span> products
              </p>
              <p className="text-gray-600 mt-2">
                Can't find what you're looking for? Contact us for custom furniture solutions.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
} 