'use client';

import { getProducts } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductList from '@/components/ProductList';
import HeroSection from '@/components/HeroSection';
import { motion } from 'framer-motion';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts({ per_page: 20, status: 'publish' });
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
                          <div className="flex items-center justify-center mb-4">
                <Badge className="px-4 py-2 bg-white border-gray-300 text-gray-700">
                  <Package className="w-4 h-4 mr-2" />
                  Our Collection
                </Badge>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Quality
                <span className="block text-black">
                  Furniture Pieces
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover our diverse range of furniture designed to enhance your living space
              </p>
            
            <Separator className="w-24 mx-auto mt-8 bg-black h-1 rounded-full" />
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Sparkles className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Unable to load products
                </h3>
                <p className="text-red-700">
                  Please check your WooCommerce configuration. Error: {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                      <div className="bg-gray-200 h-8 rounded w-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ProductList products={products} />
            </motion.div>
          )}

          {/* View All Products CTA */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="text-gray-600 mb-6">
                Showing {products.length} products from our collection
              </p>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="group px-8 py-6 text-lg font-semibold border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <Link href="/products" className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>View All Products</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
