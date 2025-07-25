'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Home, Package, Info, Mail } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeaderProps {
  siteName?: string;
}

export default function Header({ siteName = 'Horestco Furniture' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                {navigationItems.map((item, index) => (
                  <NavigationMenuItem key={item.href}>
                    <div>
                      <NavigationMenuLink asChild>
                        <Link href={item.href} className="cursor-pointer">
                          <Button 
                            variant="ghost" 
                            className="group px-4 py-2 hover:bg-gray-100 hover:text-black transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex items-center space-x-2 cursor-pointer">
                              <item.icon className="h-4 w-4" />
                              <span className="font-medium">{item.label}</span>
                            </div>

                          </Button>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>


          </nav>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-lg">
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
                  
                  <div className="space-y-2">
                    {navigationItems.map((item, index) => (
                      <div
                        key={item.href}
                      >
                        <Button 
                          asChild 
                          variant="ghost" 
                          className="w-full justify-start space-x-3 h-12 hover:bg-gray-100 hover:text-black transition-colors duration-200 cursor-pointer"
                        >
                          <Link href={item.href} className="cursor-pointer">
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>


                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 