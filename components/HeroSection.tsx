'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: Star, value: "4.9", label: "Rating", suffix: "/5" },
    { icon: ShoppingBag, value: "10K+", label: "Happy Customers" },
    { icon: TrendingUp, value: "250+", label: "Products" },
    { icon: Award, value: "8+", label: "Years Experience" }
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[60vh] bg-white flex items-center justify-center overflow-hidden pb-0 pt-12 sm:pt-20"
    >
      {/* Monochrome Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-gray-200 via-white to-gray-100 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-gray-300 via-white to-gray-100 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <Badge className="px-6 py-2 bg-white border-gray-300 text-gray-700 mb-6 shadow-sm">
          <Star className="w-4 h-4 mr-2" />
          Premium Furniture Collection
        </Badge>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          <span className="text-gray-900">Quality</span>{' '}
          <span className="text-black">Furniture for</span>{' '}
          <span className="bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">Modern Living</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
          Discover our curated collection of premium furniture designed to elevate your home with style, comfort, and sophistication.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button 
            asChild
            size="lg"
            className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-lg font-semibold rounded-xl"
          >
            <Link href="/furniture" className="flex items-center space-x-2">
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-semibold rounded-xl"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto pt-2">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-1">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-black">
                {stat.value}
                <span className="text-base text-gray-500">{stat.suffix}</span>
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 