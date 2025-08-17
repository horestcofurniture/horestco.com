'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Home, Package, Info, Mail, Search, HelpCircle, User, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeaderProps {
  siteName?: string;
}

export default function Header({ siteName = 'Horestco Furniture' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/furniture', label: 'Furniture', icon: Package },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Top Black Bar */}
      <div className="bg-black text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <p className="text-sm font-medium">Free Shipping on orders over $99</p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div 
        className={`bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center hover:opacity-80 transition-opacity duration-300"
              >
                <Image
                  src="/horestcologo.png"
                  alt="Horestco Furniture"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            
            {/* Search Bar - Center (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 rounded-md"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Icons - Right */}
            <div className="flex items-center space-x-4">
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                  <HelpCircle className="h-5 w-5" />
                  <span className="text-sm">Help</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                  <User className="h-5 w-5" />
                  <span className="text-sm">Account</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Wishlist</span>
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 bg-white">
                    <div className="flex flex-col space-y-6 mt-8">
                      <div className="text-center">
                        <Image
                          src="/horestcologo.png"
                          alt="Horestco Furniture"
                          width={100}
                          height={35}
                          className="h-8 w-auto mx-auto"
                        />
                      </div>

                      {/* Mobile Search */}
                      <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-14 py-3"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 rounded-md"
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                      
                      <div className="space-y-2">
                        {navigationItems.map((item) => (
                          <Button 
                            key={item.href}
                            asChild 
                            variant="ghost" 
                            className="w-full justify-start space-x-3 h-12 hover:bg-gray-100"
                          >
                            <Link href={item.href}>
                              <item.icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          </Button>
                        ))}
                      </div>

                      {/* Mobile Icons */}
                      <div className="space-y-2 pt-4 border-t">
                        <Button variant="ghost" className="w-full justify-start space-x-3 h-12">
                          <HelpCircle className="h-5 w-5" />
                          <span>Help</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start space-x-3 h-12">
                          <User className="h-5 w-5" />
                          <span>Account</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start space-x-3 h-12">
                          <Heart className="h-5 w-5" />
                          <span>Wishlist</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu (Desktop) */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-8 h-12">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
} 