'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { icon: Star, value: "4.9", label: "Rating", suffix: "/5" },
    { icon: TrendingUp, value: "10K+", label: "Happy Customers" },
    { icon: Award, value: "5", label: "Years Experience" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y }}
      >
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-3xl opacity-10 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur-3xl opacity-10 animate-pulse delay-500" />
      </motion.div>

      {/* Floating Particles */}
      {/* Use predetermined positions to avoid hydration mismatch */}
      {[
        { left: 15, top: 20, duration: 4, delay: 0 },
        { left: 85, top: 15, duration: 5, delay: 0.5 },
        { left: 25, top: 80, duration: 3.5, delay: 1 },
        { left: 70, top: 75, duration: 4.5, delay: 1.5 },
        { left: 45, top: 25, duration: 3, delay: 0.3 },
        { left: 90, top: 60, duration: 4.2, delay: 0.8 },
        { left: 10, top: 50, duration: 3.8, delay: 1.2 },
        { left: 60, top: 10, duration: 5.2, delay: 0.2 },
        { left: 35, top: 90, duration: 4.8, delay: 0.7 },
        { left: 80, top: 40, duration: 3.2, delay: 1.8 },
        { left: 20, top: 65, duration: 4.3, delay: 0.4 },
        { left: 75, top: 30, duration: 3.7, delay: 1.3 },
        { left: 50, top: 70, duration: 4.7, delay: 0.6 },
        { left: 5, top: 35, duration: 3.3, delay: 1.7 },
        { left: 95, top: 85, duration: 4.1, delay: 0.9 },
        { left: 30, top: 5, duration: 3.9, delay: 1.4 },
        { left: 65, top: 55, duration: 4.4, delay: 0.1 },
        { left: 40, top: 95, duration: 3.6, delay: 1.1 },
        { left: 85, top: 25, duration: 4.6, delay: 1.6 },
        { left: 12, top: 78, duration: 3.4, delay: 0.5 },
      ].map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
        />
      ))}

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ opacity }}
      >
        <div className="space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="px-4 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Premium Furniture Collection
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
              Transform Your
              <span className="block text-black">
                Living Space
              </span>
            </h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover our curated collection of premium furniture designed to elevate your home with style, comfort, and sophistication.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              asChild
              size="lg"
              className="group bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/products" className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Collection</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="px-8 py-6 text-lg font-semibold border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <stat.icon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  <span className="text-sm text-gray-500">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
} 