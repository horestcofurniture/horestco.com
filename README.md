# WordPress + WooCommerce Frontend

A modern Next.js frontend that uses WordPress as a headless CMS and WooCommerce for e-commerce functionality.!

## Features

### WordPress Integration
- ✅ Fetch and display WordPress posts
- ✅ Individual post pages with SEO optimization
- ✅ Featured images and excerpts
- ✅ Categories and tags support
- ✅ Error handling and loading states

### WooCommerce Integration
- ✅ Product catalog with grid layout
- ✅ Individual product pages
- ✅ Price display with sale pricing
- ✅ Stock status indicators
- ✅ Product images and galleries
- ✅ Product categories and ratings
- ✅ SEO optimized product pages
- ✅ Official TypeScript WooCommerce REST API client

### Technical Features
- ✅ TypeScript for type safety
- ✅ Responsive design with Tailwind CSS
- ✅ Server-side rendering with Next.js 15
- ✅ Image optimization
- ✅ Built-in error handling and retries
- ✅ Modern OAuth 1.0a authentication
- ✅ Official WooCommerce TypeScript client

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```env
# WordPress Backend Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_NAME=Your Site Name

# WooCommerce API Configuration
WOOCOMMERCE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret_here
```

### 2. WooCommerce API Setup

1. **Enable WooCommerce REST API:**
   - Go to your WordPress admin → WooCommerce → Settings → Advanced → REST API
   - Click "Add Key"
   - Set Description: "Next.js Frontend"
   - Set User: Your admin user
   - Set Permissions: "Read"
   - Click "Generate API Key"

2. **Copy the credentials:**
   - Consumer Key → `WOOCOMMERCE_CONSUMER_KEY`
   - Consumer Secret → `WOOCOMMERCE_CONSUMER_SECRET`

### 3. WordPress Requirements

Your WordPress site needs:
- WordPress REST API enabled (default in modern WordPress)
- WooCommerce plugin installed and configured
- Products with published status
- Featured images set for better visual appeal

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

## Project Structure

```
├── app/
│   ├── page.tsx                 # Homepage with WordPress posts
│   ├── posts/[slug]/page.tsx    # Individual post pages
│   ├── products/
│   │   ├── page.tsx             # Products catalog
│   │   └── [slug]/page.tsx      # Individual product pages
│   └── layout.tsx               # Root layout with header
├── components/
│   ├── Header.tsx               # Site navigation
│   ├── PostCard.tsx             # WordPress post preview
│   ├── PostList.tsx             # Grid of posts
│   ├── ProductCard.tsx          # WooCommerce product preview
│   └── ProductList.tsx          # Grid of products
├── lib/
│   ├── types.ts                 # WordPress types
│   ├── wordpress.ts             # WordPress API functions
│   ├── woocommerce-types.ts     # WooCommerce types
│   └── woocommerce.ts           # WooCommerce API functions
└── .env.local                   # Environment variables
```

## API Functions

### WordPress API
- `getPosts()` - Fetch blog posts
- `getPost(id)` - Get single post
- `getPostBySlug(slug)` - Get post by slug
- `getPages()` - Fetch pages
- `getFeaturedImage()` - Get post featured image

### WooCommerce API
- `getProducts()` - Fetch products
- `getProduct(id)` - Get single product
- `getProductBySlug(slug)` - Get product by slug
- `getProductCategories()` - Fetch product categories
- `formatPrice()` - Format price with currency
- `isProductOnSale()` - Check if product is on sale

## Pages

### Homepage (`/`)
- Displays latest WordPress posts
- Hero section with site branding
- Responsive grid layout

### Products Page (`/products`)
- WooCommerce product catalog
- Product cards with images, prices, and ratings
- Stock status indicators
- Sale badges and discount percentages

### Individual Product Page (`/products/[slug]`)
- Full product details and images
- Price display with sale pricing
- Stock status and ratings
- Product description and specifications
- Link to WooCommerce store for purchase

### Individual Post Page (`/posts/[slug]`)
- Full blog post content
- Featured image display
- Publication date and metadata
- SEO optimized

## Customization

### Styling
The project uses Tailwind CSS. Customize colors, fonts, and spacing in:
- `tailwind.config.js` (if needed)
- Component classes

### API Caching
- WordPress API: 60-second revalidation
- WooCommerce API: 5-minute revalidation
- Adjust in `lib/wordpress.ts` and `lib/woocommerce.ts`

### Product Display
Modify product cards in `components/ProductCard.tsx`:
- Change layout and styling
- Add/remove product information
- Customize price formatting

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
Ensure environment variables are properly configured on your hosting platform.

## Troubleshooting

### Common Issues

1. **"WooCommerce API credentials are not configured"**
   - Check your `.env.local` file
   - Ensure API keys are correct
   - Verify WooCommerce REST API is enabled

2. **Products not loading**
   - Check WooCommerce API permissions (should be "Read")
   - Verify products are published
   - Check browser console for API errors

3. **WordPress posts not loading**
   - Verify WordPress REST API is accessible
   - Check WORDPRESS_API_URL format
   - Ensure posts are published

4. **Images not displaying**
   - Check if WordPress/WooCommerce images are publicly accessible
   - Verify image URLs in API responses
   - Check Next.js image domain configuration if needed

## License

MIT License - feel free to use this project as a starting point for your own WordPress + WooCommerce frontend!
