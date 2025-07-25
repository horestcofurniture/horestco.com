import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, Users, Award, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Horestco Furniture',
  description: 'Learn about Horestco Furniture - your trusted partner for quality furniture solutions.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Years in Business', value: '10+', icon: Clock },
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Products Available', value: '500+', icon: Package },
    { label: 'Quality Awards', value: '25+', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="px-4 py-2 bg-white text-black mb-6">
              About Horestco
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Quality Furniture
              <span className="block">Since 2014</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to providing exceptional furniture that combines timeless design, 
              superior craftsmanship, and unmatched quality for homes and businesses across Malaysia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-black mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Our Story
            </h2>
            <Separator className="w-24 mx-auto bg-black h-1" />
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-gray-200">
                <CardContent className="p-0">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Founded in 2014, Horestco Furniture began as a small family business with a simple mission: 
                    to create beautiful, functional furniture that enhances people's lives. What started in a 
                    modest workshop has grown into one of Malaysia's most trusted furniture providers.
                  </p>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Our commitment to quality craftsmanship and customer satisfaction has been the cornerstone 
                    of our success. We work closely with skilled artisans and use only the finest materials 
                    to create furniture that stands the test of time.
                  </p>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Today, we serve thousands of customers across Malaysia, providing everything from elegant 
                    dining sets to comfortable office furniture. Our showroom and online catalog showcase 
                    hundreds of carefully curated pieces, each selected for its quality, style, and value.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Our Values
            </h2>
            <Separator className="w-24 mx-auto bg-white h-1" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We never compromise on the quality of materials or craftsmanship in our furniture.'
              },
              {
                title: 'Customer Focus',
                description: 'Your satisfaction is our priority. We listen, understand, and deliver exactly what you need.'
              },
              {
                title: 'Timeless Design',
                description: 'Our furniture combines classic elegance with modern functionality for lasting appeal.'
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 