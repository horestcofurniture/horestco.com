import { Metadata } from 'next';
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
    { icon: Package, value: '500+', label: 'Products Sold' },
    { icon: Users, value: '1000+', label: 'Happy Customers' },
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: Clock, value: '24/7', label: 'Customer Support' },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We source only the finest materials and work with skilled craftsmen to ensure every piece meets our high standards.'
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We provide personalized service and support throughout your furniture journey.'
    },
    {
      title: 'Timeless Design',
      description: 'Our furniture combines classic elegance with modern functionality for lasting appeal.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-white text-black border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="px-4 py-2 bg-white text-black mb-6">
              About Horestco
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Quality Furniture
              <span className="block">Since 2014</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to providing exceptional furniture that combines timeless design, 
              superior craftsmanship, and unmatched quality for homes and businesses across Malaysia.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-white rounded-full shadow-lg">
                    <stat.icon className="h-8 w-8 text-black" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-black mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
            <Separator className="w-24 mx-auto bg-black h-1 rounded-full" />
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                At Horestco, we believe that quality furniture should be accessible to everyone. 
                Our mission is to provide beautiful, durable, and affordable furniture solutions 
                that transform houses into homes and offices into inspiring workspaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Our Values</h2>
            <Separator className="w-24 mx-auto bg-black h-1 rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center"
              >
                <Card className="h-full border-0 shadow-lg bg-white">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-black mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 