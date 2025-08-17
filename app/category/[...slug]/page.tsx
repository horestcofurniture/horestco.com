'use client';

export const runtime = 'edge';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getProducts, getProductCategories } from '@/lib/woocommerce';
import { WooCommerceProduct, WooCommerceProductCategory } from '@/lib/woocommerce-types';
import ProductGrid from '@/components/ProductGrid';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, Filter, Grid, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slugArray = params.slug as string[];
  
  // Parse slug array to handle both single and nested routes
  const isNested = slugArray.length === 2;
  const parentSlug = slugArray[0];
  const childSlug = isNested ? slugArray[1] : null;
  
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [categories, setCategories] = useState<WooCommerceProductCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<WooCommerceProductCategory | null>(null);
  const [parentCategory, setParentCategory] = useState<WooCommerceProductCategory | null>(null);
  const [subcategories, setSubcategories] = useState<WooCommerceProductCategory[]>([]);
  const [siblingCategories, setSiblingCategories] = useState<WooCommerceProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Find category by slug
  const findCategoryBySlug = useCallback((cats: WooCommerceProductCategory[], slug: string): WooCommerceProductCategory | null => {
    return cats.find(cat => cat.slug === slug) || null;
  }, []);

  // Load products for category
  const loadProducts = useCallback(async (categoryId: number, pageNum: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const newProducts = await getProducts({
        page: pageNum,
        per_page: 20,
        status: 'publish',
        category: categoryId.toString()
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

  // Load initial data
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        console.log('Debug: Loading categories for slugArray:', slugArray, 'isNested:', isNested, 'parentSlug:', parentSlug, 'childSlug:', childSlug);
        
        const fetchedCategories = await getProductCategories();
        console.log('Debug: Fetched categories:', fetchedCategories.length);
        setCategories(fetchedCategories);
        
        if (isNested && childSlug) {
          // Handle nested category (parent/child)
          const parent = findCategoryBySlug(fetchedCategories, parentSlug);
          console.log('Debug: Found parent category:', parent);
          
          if (!parent) {
            setError(`Parent category "${parentSlug}" not found. Available categories: ${fetchedCategories.map(c => c.slug).join(', ')}`);
            return;
          }
          setParentCategory(parent);
          
          const child = findCategoryBySlug(fetchedCategories, childSlug);
          console.log('Debug: Found child category:', child);
          
          if (!child) {
            const childCategories = fetchedCategories.filter(cat => cat.parent === parent.id);
            setError(`Child category "${childSlug}" not found. Available subcategories for ${parent.name}: ${childCategories.map(c => c.slug).join(', ')}`);
            return;
          }
          
          // Verify hierarchy
          if (child.parent !== parent.id) {
            setError(`Invalid category hierarchy. ${child.name} is not a child of ${parent.name}`);
            return;
          }
          
          setCurrentCategory(child);
          
          // Find sibling categories
          const siblings = fetchedCategories.filter(cat => 
            cat.parent === parent.id && cat.id !== child.id
          );
          setSiblingCategories(siblings);
          
          // Load products for child category
          await loadProducts(child.id, 1, true);
        } else {
          // Handle single category
          const category = findCategoryBySlug(fetchedCategories, parentSlug);
          console.log('Debug: Found single category:', category);
          
          if (!category) {
            setError(`Category "${parentSlug}" not found. Available categories: ${fetchedCategories.map(c => c.slug).join(', ')}`);
            return;
          }
          
          setCurrentCategory(category);
          
          // Find subcategories
          const subs = fetchedCategories.filter(cat => cat.parent === category.id);
          setSubcategories(subs);
          
          // Load products for this category
          await loadProducts(category.id, 1, true);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch category data');
      }
    }

    if (slugArray && slugArray.length > 0) {
      fetchInitialData();
    }
  }, [slugArray, parentSlug, childSlug, isNested, findCategoryBySlug, loadProducts]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (currentCategory && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(currentCategory.id, nextPage);
    }
  }, [currentCategory, hasMore, loading, page, loadProducts]);

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button asChild className="bg-black hover:bg-gray-800 text-white">
              <Link href="/furniture">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-6"></div>
            <p className="text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/furniture" className="hover:text-black">Furniture</Link>
          <span>/</span>
          {isNested && parentCategory ? (
            <>
              <Link href={`/category/${parentCategory.slug}`} className="hover:text-black">
                {parentCategory.name}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-black font-medium">{currentCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              {isNested && parentCategory && (
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {parentCategory.name}
                  </Badge>
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-thin text-black mb-4">
                {currentCategory.name}
              </h1>
              {currentCategory.description && (
                <div 
                  className="text-lg font-light text-black max-w-3xl leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentCategory.description }}
                />
              )}
            </div>
            
            <div className="hidden md:flex flex-col space-y-2">
              {isNested && parentCategory ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/category/${parentCategory.slug}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All {parentCategory.name}
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="ghost" size="sm">
                <Link href="/furniture">
                  All Products
                </Link>
              </Button>
            </div>
          </div>

          {/* Subcategories or Sibling Categories */}
          {isNested && siblingCategories.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                More in {parentCategory?.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {siblingCategories.map((sibling) => (
                  <Badge key={sibling.id} asChild variant="secondary" className="cursor-pointer hover:bg-gray-200">
                    <Link href={`/category/${parentCategory?.slug}/${sibling.slug}`}>
                      {sibling.name} ({sibling.count})
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          ) : subcategories.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Browse Subcategories</h3>
              <div className="flex flex-wrap gap-3">
                {subcategories.map((subcat) => (
                  <Badge key={subcat.id} asChild variant="secondary" className="cursor-pointer hover:bg-gray-200">
                    <Link href={`/category/${currentCategory.slug}/${subcat.slug}`}>
                      {subcat.name} ({subcat.count})
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Products Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl">
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
                <span>in {currentCategory.name}</span>
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
          className="mb-12"
        />

        {/* Load More */}
        {hasMore && !loading && products.length > 0 && (
          <div className="text-center py-8">
            <Button 
              onClick={loadMoreProducts}
              size="lg" 
              variant="outline"
              className="px-8"
            >
              Load More Products
            </Button>
          </div>
        )}

        {/* End of results */}
        {!hasMore && products.length > 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              You've seen all products in {currentCategory.name}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
