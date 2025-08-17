'use client';

import { getProducts, getProductCategories, getCategoryWithImage, getCategoryBySlug } from '@/lib/woocommerce';
import { WooCommerceProduct, WooCommerceProductCategory } from '@/lib/woocommerce-types';
import ProductGrid from '@/components/ProductGrid';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, Umbrella, Armchair, Table, Flower, Sofa, Coffee, Bed, Settings, TreePine } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [categories, setCategories] = useState<WooCommerceProductCategory[]>([]);
  const [categoryImages, setCategoryImages] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // First fetch basic data
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts({ per_page: 20, status: 'publish' }),
          getProductCategories()
        ]);
        
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
        
        // Then fetch category images for each outdoor category
        const outdoorCategorySlugs = [
          'outdoor-dining-tables',
          'cushionscovers-canopies',
          'miscellaneous-outdoor',
          'outdoor-benches',
          'outdoor-chairs',
          'outdoor-coffee-side-tables',
          'outdoor-sofa',
          'sun-loungers',
          'terrace-sets',
          'umbrella-stands',
          'umbrellas'
        ];
        
        const imagePromises = outdoorCategorySlugs.map(async (slug) => {
          const category = fetchedCategories.find(cat => cat.slug === slug);
          if (category) {
            const categoryWithImage = await getCategoryWithImage(category.id);
            return { slug, image: categoryWithImage?.featured_image?.url || null };
          }
          return { slug, image: null };
        });
        
        const imageResults = await Promise.all(imagePromises);
        console.log('Image results:', imageResults);
        
        const imageMap: { [key: string]: string } = {};
        imageResults.forEach(result => {
          if (result.image) {
            imageMap[result.slug] = result.image;
          }
        });
        
        console.log('Final image map:', imageMap);
        setCategoryImages(imageMap);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Define the specific outdoor category slugs you provided
  const outdoorCategorySlugs = [
    'outdoor-dining-tables',
    'cushionscovers-canopies',
    'miscellaneous-outdoor',
    'outdoor-benches',
    'outdoor-chairs',
    'outdoor-coffee-side-tables',
    'outdoor-sofa',
    'sun-loungers',
    'terrace-sets',
    'umbrella-stands',
    'umbrellas'
  ];

  // Icon mapping for specific categories
  const getIconForSlug = (slug: string) => {
    if (slug.includes('dining-tables') || slug.includes('terrace-sets')) return Table;
    if (slug.includes('chairs') || slug.includes('benches')) return Armchair;
    if (slug.includes('sofa')) return Sofa;
    if (slug.includes('coffee-side-tables')) return Coffee;
    if (slug.includes('sun-loungers')) return Bed;
    if (slug.includes('umbrellas') && !slug.includes('stands')) return Umbrella;
    if (slug.includes('umbrella-stands')) return TreePine;
    if (slug.includes('cushionscovers-canopies')) return Settings;
    if (slug.includes('miscellaneous')) return Package;
    return Package; // Default icon
  };

  // Get display names for categories
  const getDisplayName = (slug: string) => {
    const nameMap: { [key: string]: string } = {
      'outdoor-dining-tables': 'Outdoor Dining Tables',
      'cushionscovers-canopies': 'Cushions, Covers & Canopies',
      'miscellaneous-outdoor': 'Miscellaneous Outdoor',
      'outdoor-benches': 'Outdoor Benches',
      'outdoor-chairs': 'Outdoor Chairs',
      'outdoor-coffee-side-tables': 'Coffee & Side Tables',
      'outdoor-sofa': 'Outdoor Sofa',
      'sun-loungers': 'Sun Loungers',
      'terrace-sets': 'Terrace Sets',
      'umbrella-stands': 'Umbrella Stands',
      'umbrellas': 'Umbrellas'
    };
    return nameMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Find the specific categories from WooCommerce data
  const specificOutdoorCategories = outdoorCategorySlugs.map(slug => {
    const foundCategory = categories.find(cat => cat.slug === slug);
    return {
      slug,
      name: foundCategory?.name || getDisplayName(slug),
      icon: getIconForSlug(slug),
      description: foundCategory?.description || `Explore our ${getDisplayName(slug).toLowerCase()} collection`,
      href: `/category/outdoor/${slug}`,
      image: categoryImages[slug] || null,
      count: foundCategory?.count || 0,
      found: !!foundCategory
    };
  });

  // Display first 8 subcategories in grid, with option to show more
  const displayedSubcategories = specificOutdoorCategories.slice(0, 8);

  return (
    <div className="min-h-screen pt-24">
      {/* Outdoor Furniture Section */}
      <section className="relative bg-white py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-left mb-16">
            <h2 className="text-4xl sm:text-5xl font-thin text-black mb-6">
              Outdoor Furniture
            </h2>
            
            <p className="text-lg font-light text-black max-w-2xl leading-relaxed mb-8">
              Create the perfect outdoor oasis with our premium collection of weather-resistant furniture and accessories
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedSubcategories.map((subcategory, index) => (
              <Link
                key={subcategory.name}
                href={subcategory.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  {/* Category Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {subcategory.image ? (
                      <>
                        <Image
                          src={subcategory.image}
                          alt={subcategory.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <subcategory.icon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Icon Overlay (only if image exists) */}
                    {subcategory.image && (
                      <div className="absolute top-4 right-4">
                        <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full group-hover:bg-white transition-colors duration-300">
                          <subcategory.icon className="h-4 w-4 text-black" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors duration-300 line-clamp-2 flex-1">
                        {subcategory.name}
                      </h3>
                      {subcategory.count > 0 && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex-shrink-0">
                          {subcategory.count}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {subcategory.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black group-hover:text-gray-800 transition-colors duration-300">
                        Explore
                      </span>
                      <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More Button */}
          {specificOutdoorCategories.length > 8 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/category/outdoor" className="flex items-center space-x-2">
                  <span>View All {specificOutdoorCategories.length} Categories</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
          
          {/* Debug info for categories not found in WooCommerce */}
          {!loading && (
            <div className="mt-8 text-center space-y-1">
              <p className="text-sm text-gray-500">
                Found {specificOutdoorCategories.filter(cat => cat.found).length} of {specificOutdoorCategories.length} categories in WooCommerce
              </p>
              <p className="text-sm text-gray-500">
                {Object.keys(categoryImages).length} categories have featured images
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-100 pt-16 pb-16 z-10 rounded-t-3xl shadow-lg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
