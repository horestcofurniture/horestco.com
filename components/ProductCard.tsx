'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from 'lucide-react';
import { WooCommerceProduct } from '@/lib/woocommerce-types';

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {

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
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            )}
            {product.on_sale && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-black text-white font-medium text-xs px-2 py-1 rounded">Sale</Badge>
              </div>
            )}
          </div>
          <div className="p-3 space-y-2">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
                {product.name}
              </h3>
              {product.short_description && (
                <p 
                  className="text-xs text-gray-500 line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}
            </div>
            {product.categories && product.categories.length > 0 && (
              <div className="flex items-center justify-start">
                <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                  {product.categories[0].name}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 