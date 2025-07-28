'use client';

import { getProducts } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductGrid from '@/components/ProductGrid';
import HeroSection from '@/components/HeroSection';

import { Badge } from "@/components/ui/badge";
import { Package } from 'lucide-react';
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

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto">
          <ProductGrid 
            products={products}
            loading={loading}
            error={error}
            maxItems={4}
            showViewAll={true}
            viewAllHref="/furniture"
            viewAllText="View All Products"
          />
        </div>
      </section>
    </div>
  );
}
