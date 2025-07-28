import type { NextConfig } from "next";

function getImageDomains(): string[] {
  const domains: string[] = [];
  
  // Extract hostname from WooCommerce URL (server-side env var)
  if (process.env.WOOCOMMERCE_URL) {
    try {
      const wooUrl = new URL(process.env.WOOCOMMERCE_URL);
      domains.push(wooUrl.hostname);
    } catch (error) {
      console.warn('Invalid WOOCOMMERCE_URL:', error);
    }
  }
  
  // Extract hostname from WordPress API URL
  if (process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    try {
      const wpUrl = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
      // Only add if different from WooCommerce hostname
      if (!domains.includes(wpUrl.hostname)) {
        domains.push(wpUrl.hostname);
      }
    } catch (error) {
      console.warn('Invalid NEXT_PUBLIC_WORDPRESS_API_URL:', error);
    }
  }
  
  return domains;
}

const nextConfig: NextConfig = {
  images: {
    domains: getImageDomains(),
    unoptimized: true, // Required for Cloudflare Pages
  },
};

export default nextConfig;
