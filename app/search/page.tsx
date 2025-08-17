'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WooCommerceProduct } from '@/lib/woocommerce-types';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SearchResults {
  products: WooCommerceProduct[];
  query: string;
  page: number;
  per_page: number;
  total_results: number;
  has_more: boolean;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim() || query.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&page=${page}&per_page=20`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const searchResults: SearchResults = await response.json();
      setResults(searchResults);
      setCurrentPage(page);
      
      // Update URL without triggering a reload
      const newUrl = `/search?q=${encodeURIComponent(query.trim())}${page > 1 ? `&page=${page}` : ''}`;
      window.history.replaceState({}, '', newUrl);

    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch(searchQuery, 1);
  };

  const handleLoadMore = () => {
    if (results && results.has_more) {
      performSearch(searchQuery, currentPage + 1);
    }
  };

  // Perform search on initial load if query exists
  useEffect(() => {
    if (initialQuery) {
      const pageParam = searchParams.get('page');
      const page = pageParam ? parseInt(pageParam) : 1;
      setCurrentPage(page);
      performSearch(initialQuery, page);
    }
  }, [initialQuery, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back to Home */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search for furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !searchQuery.trim()}
              className="px-8 py-3"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {results && (
          <div className="mb-6">
            <p className="text-gray-600">
              {results.total_results > 0 
                ? `Found ${results.total_results} result${results.total_results !== 1 ? 's' : ''} for "${results.query}"`
                : `No results found for "${results.query}"`
              }
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && !results && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {/* Results Grid */}
        {results && results.products.length > 0 && (
          <div className="space-y-8">
            <ProductGrid 
              products={results.products} 
              loading={false}
            />
            
            {/* Load More Button */}
            {results.has_more && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="px-8 py-3"
                >
                  {loading ? 'Loading...' : 'Load More Results'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {results && results.products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse our categories instead.
              </p>
              <Link href="/">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!results && !loading && !initialQuery && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">
              Enter a search term above to find products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
