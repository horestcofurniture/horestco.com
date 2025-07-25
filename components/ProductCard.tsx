'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Package } from 'lucide-react';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import { 
  formatPrice, 
  getProductMainImage, 
  getProductExcerpt, 
  isProductOnSale, 
  getDiscountPercentage 
} from '@/lib/woocommerce';

interface ProductCardProps {
  product: WooCommerceProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const mainImage = getProductMainImage(product);  
  const onSale = isProductOnSale(product);
  const discountPercentage = getDiscountPercentage(product);
  const rating = parseFloat(product.average_rating);

  return (
    <Link href={`/furniture/${product.slug}`} className="group h-full block">
        <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative w-full h-64 overflow-hidden">
              {mainImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Package className="w-16 h-16 text-gray-300" />
                  </motion.div>
                </div>
              )}
              

            </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {onSale && (
              <motion.div
                initial={{ scale: 0, rotate: 12 }}
                animate={{ scale: 1, rotate: 12 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Badge className="bg-black text-white border-0 shadow-lg">
                  -{discountPercentage}%
                </Badge>
              </motion.div>
            )}
            
            {product.stock_status === 'outofstock' && (
              <Badge variant="secondary" className="bg-gray-800/90 text-white border-0">
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Stock indicator */}

        </div>
        
        <CardContent className="flex-1 p-6 space-y-4">
          {/* Product Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.categories.slice(0, 2).map((category) => (
                <Badge 
                  key={category.id}
                  variant="outline" 
                                        className="text-xs bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Product Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {rating.toFixed(1)} ({product.rating_count})
              </span>
            </div>
          )}
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {getProductExcerpt(product, 120)}
          </p>
        </CardContent>
        
        <Separator className="mx-6" />
        
        <CardFooter className="p-6 pt-4 space-y-4">
          {/* Price */}
          <div className="w-full space-y-3">
            {/* Main Price */}
            <div className="flex items-baseline space-x-3">
              {onSale ? (
                <>
                                      <span className="text-2xl font-bold text-black">
                    {formatPrice(product.sale_price)}
                                      </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price || product.regular_price)}
                </span>
              )}
            </div>
            
            {/* Save Badge */}
            {onSale && (
              <div className="flex justify-start">
                <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-sm">
                  Save {formatPrice((parseFloat(product.regular_price) - parseFloat(product.sale_price)).toString())}
                </Badge>
              </div>
            )}
          </div>
          

        </CardFooter>
        </Card>
    </Link>
  );
} 