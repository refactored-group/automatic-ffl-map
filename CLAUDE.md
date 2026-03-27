# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm start              # Start development server on http://localhost:3000
npm test               # Run tests in interactive watch mode
npm run build          # Production build (sets PUBLIC_URL=/big-commerce-enhanced-checkout)
npm run build:dev      # Local development build
npm run generate-config # Generate config.js from environment variables
npm run minify-js      # Minify bigcommerce.js with terser
```

## Environment Variables

Required before building:
- `FFL_STORE_ENDPOINT` - Backend API endpoint for store configuration
- `FFL_IFRAME_URL` - URL to the React iframe app
- `REACT_APP_HOST` - Backend API host for dealer search
- `REACT_APP_GOOGLE_MAPS_KEY` - Google Maps API key

## Architecture Overview

This is a React TypeScript application that provides an FFL (Federal Firearms License) dealer locator. It's designed to be embedded as an iframe within BigCommerce's checkout process.

### Key Components

**App.tsx** - Root component that validates URL query parameters (`store_hash`, `platform`) and handles parent window communication via `window.postMessage()`.

**Locator.tsx** (`src/components/Dealer/Locator.tsx`) - Main class-based container component managing:
- Search state (location, radius, dealers, loading)
- API calls to fetch dealers
- Orchestration of Header, Search, DealerList, and DealerMap components

**Component hierarchy:**
```
App → Locator → Header, Search, DealerList (→ DealerCard[]), DealerMap (→ LocatorMap → Markers)
```

### BigCommerce Integration

**public/js/bigcommerce.js** - Handles all BigCommerce checkout integration:
- GraphQL queries via BigCommerce Storefront API
- Product classification (firearm, ammo, regular) via FFL custom fields
- Checkout step injection (adds "Shipping FFL" step)
- Shipping consignment creation
- Cross-window messaging with the React iframe

**Integration flow:**
1. BigCommerce loads config.js then bigcommerce.js via Script Manager
2. Products classified by FFL_TYPE custom field ('firearm', 'ammo')
3. FFL step injected into checkout if cart contains firearms
4. React app opens as modal for dealer selection
5. Selected dealer passed back via postMessage
6. Shipping consignments created for FFL items

### State Management

- Local component state via `this.state` in class components
- Props drilling for passing callbacks and data
- Global `FFLConfigs` object in bigcommerce.js tracks checkout state

### API Integration

- Dealer search: `${REACT_APP_HOST}/store-front/api/${storeHash}/dealers?location=${location}&radius=${radius}`
- BigCommerce: GraphQL Storefront API for cart/checkout operations

### Critical: postMessage Dealer Data Structure

This app runs as an iframe embedded in parent checkout apps. When a dealer is selected, `handleSelect` in `src/components/Dealer/components/LocatorMap/utils.ts` constructs the dealer object and sends it to the parent window via postMessage.

**The `handleSelect` function manually maps dealer fields - it does not pass through the raw API response.** If the backend API adds new fields that parent apps need (e.g., `uuid` for certificate URLs), you MUST add them to `handleSelect`.

Current fields sent to parent:
- `id`, `phone`, `company`
- `address1`, `address2`, `addressFormatted`, `city`, `stateOrProvinceCode`, `postalCode`
- `countryCode`, `localizedCountry`, `shouldSaveAddress`
- `fflID`, `uuid`

**Note on customer name:** The dealer payload intentionally does NOT include `firstName`/`lastName`. The customer's name is sourced by each consumer (BC checkout-js fork, WC plugin, BC drop-in `public/js/bigcommerce.js`, Magento, Shopify) from their own platform state — the customer's billing/account record. This produces the correct shipping label: `<customer name> c/o <dealer business name>` rather than overloading the customer's name fields with the dealer's identity. The `company` field carries the dealer's `business_name` only (no license suffix); the license is available separately as `fflID`.

### Styling

- Tailwind CSS with custom colors: primary (#4A276B), secondary (#f26b20), preferred (#f9a826)
- SCSS files in component directories
