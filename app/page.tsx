'use client';

import { getProducts } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductList from '@/components/ProductList';
import HeroSection from '@/components/HeroSection';

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
      <section className="relative bg-gradient-to-b from-white to-gray-100 pt-16 pb-16 z-10 rounded-t-3xl shadow-lg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Badge className="px-4 py-2 bg-white border-gray-300 text-gray-700">
                <Package className="w-4 h-4 mr-2" />
                Our Collection
              </Badge>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Featured <span className="text-gray-600">Products</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our diverse range of furniture designed to enhance your living space
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-12">
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
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
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
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div>
            <ProductList products={products} />
          </div>
        )}

        {/* View All Products CTA */}
        {products.length > 0 && (
          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl">
              <Link href="/furniture" className="flex items-center space-x-3">
                <Package className="w-5 h-5" />
                <span>View All Products</span>
                <div>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
