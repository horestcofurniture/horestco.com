import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Horestco Furniture',
  description: 'Get in touch with Horestco Furniture. Visit our showroom, call us, or send us a message.',
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Showroom',
      details: [
        'Jalan Furniture Street 123',
        'Kuala Lumpur, Malaysia 50000',
        'Free parking available'
      ]
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        '+60 3-1234 5678',
        '+60 12-345 6789 (Mobile)',
        'Mon-Sat: 9AM-6PM'
      ]
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        'info@horestco.com',
        'sales@horestco.com',
        'We reply within 24 hours'
      ]
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Public Holidays', hours: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-white text-black border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="px-4 py-2 bg-white text-black mb-6">
              Contact Us
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about our furniture? Want to visit our showroom? 
              We're here to help you find the perfect pieces for your space.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">How to Reach Us</h2>
            <Separator className="w-24 mx-auto bg-black h-1 rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="text-center"
              >
                <Card className="h-full border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <info.icon className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-black">
                      {info.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Business Hours */}
          <div className="mt-16">
            <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Clock className="h-8 w-8 text-black" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-black">
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white text-black border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Visit our showroom to see our furniture collection in person, or get in touch with our team for personalized assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black text-white hover:bg-gray-900 px-8 py-4">
                <MapPin className="w-5 h-5 mr-2" />
                Visit Showroom
              </Button>
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-gray-100 px-8 py-4">
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 