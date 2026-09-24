# DEZ-STORE

A modern e-commerce platform integrating Stripe, Shopify, and Printify with Next.js and Tailwind CSS.

## Features

- **Product Catalog**: Display products from integrated platforms
- **Shopping Cart**: Full-featured cart functionality
- **Checkout Process**: Secure payment processing with Stripe
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **API Integration**: Connects with Stripe, Shopify, and Printify APIs
- **Branded UI**: Custom logo and favicon
- **Printify Integration**: Automated product creation script for Printify

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Stripe API
- Shopify Admin API
- Printify API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory with the following variables:
   ```env
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   SHOPIFY_STORE_DOMAIN=your_store_domain.myshopify.com
   SHOPIFY_ADMIN_ACCESS_TOKEN=your_shopify_admin_access_token
   PRINTIFY_API_KEY=your_printify_api_key
   PRINTIFY_SHOP_ID=your_printify_shop_id
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret key for API requests
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key for client-side operations
- `SHOPIFY_STORE_DOMAIN`: Your Shopify store domain
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: Your Shopify admin access token
- `PRINTIFY_API_KEY`: Your Printify API key
- `PRINTIFY_SHOP_ID`: Your Printify shop ID
- `NEXT_PUBLIC_SITE_URL`: The URL of your deployed site

## API Routes

- `GET /api/products` - Retrieve products from Stripe
- `GET /api/integrations` - Check connection status of all integrations
- `POST /api/checkout/printify` - Create a Stripe checkout session
- `GET /api/cart` - Retrieve cart items
- `POST /api/cart` - Add item to cart

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run printify-rebel-drop` - Run the Printify rebel drop script to create products with images

## Project Structure

```
app/
├── api/
│   ├── cart/
│   ├── checkout/
│   ├── products/
│   └── integrations/
├── cart/
├── checkout/
├── product/[id]/
├── products/
├── success/
├── globals.css
├── layout.tsx
└── page.tsx
public/
├── favicon.ico
├── images/
│   ├── logo.png
│   └── badge.png
└── printify/
    └── (rebel art images)
scripts/
└── printify-rebel-drop.js
```

## Components

- Homepage with hero section and featured products
- Product grid with filtering and sorting
- Individual product pages with image galleries
- Shopping cart with quantity adjustment
- Checkout flow with shipping and payment information
- Order success confirmation page

## Printify Rebel Drop Feature

The application includes a script to automate creating products on Printify with custom images:

1. Add your rebel art images to `public/printify/`
2. Set your Printify credentials in `.env.local`
3. Run the script:
   ```bash
   npm run printify-rebel-drop
   ```

This will upload your images and create corresponding products on Printify with multiple variants.

## Deployment

This application is designed for deployment on Vercel. Simply connect your GitHub repository to Vercel and add your environment variables in the Vercel dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request