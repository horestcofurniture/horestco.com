'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Package } from 'lucide-react';
import { WooCommerceProduct } from '@/lib/woocommerce-types';

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(numPrice);
  };

  const getStockStatus = () => {
    if (product.stock_status === 'instock') {
      return { text: 'In Stock', color: 'bg-gray-200 text-gray-800' };
    } else if (product.stock_status === 'outofstock') {
      return { text: 'Out of Stock', color: 'bg-gray-300 text-gray-500' };
    } else {
      return { text: 'Available', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Link href={`/furniture/${product.slug}`} className="block group h-full">
      <Card className="h-full overflow-hidden border border-gray-100 hover:border-black transition-all duration-200 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div>
                  <Package className="h-20 w-20 text-gray-400" />
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className={`${stockStatus.color} font-medium text-xs px-2 py-1 rounded`}>{stockStatus.text}</Badge>
            </div>
            {product.on_sale && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-black text-white font-medium text-xs px-2 py-1 rounded">Sale</Badge>
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
                {product.name}
              </h3>
              {product.short_description && (
                <p 
                  className="text-xs text-gray-500 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                {product.on_sale && product.regular_price !== product.price ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.regular_price)}
                    </span>
                    <span className="text-base font-bold text-black">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-base font-bold text-black">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {product.average_rating || '0'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 