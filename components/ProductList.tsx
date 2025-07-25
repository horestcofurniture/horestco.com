'use client';

import { motion } from 'framer-motion';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

interface ProductListProps {
  products: WooCommerceProduct[];
  title?: string;
}

export default function ProductList({ products, title = "Products" }: ProductListProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Package className="w-12 h-12 text-gray-400" />
          </motion.div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No products found</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Check back later for new products, or browse our other collections!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </div>
  );
} 