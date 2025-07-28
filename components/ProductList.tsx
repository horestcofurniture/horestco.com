'use client';

import ProductGrid from './ProductGrid';
import { WooCommerceProduct } from '@/lib/woocommerce-types';

interface ProductListProps {
  products: WooCommerceProduct[];
  title?: string;
  maxItems?: number;
}

export default function ProductList({ products, title, maxItems = 4 }: ProductListProps) {
  return (
    <ProductGrid 
      products={products}
      title={title}
      maxItems={maxItems}
      gridCols="4"
    />
  );
} 