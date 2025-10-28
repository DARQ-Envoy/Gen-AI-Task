# LLM Lab - SSR Architecture Documentation

## Overview

This Next.js application has been restructured to conform to modern SSR (Server-Side Rendering) guidelines with proper separation of server and client components, state management, and routing.

## Architecture Highlights

### ✅ Server-Side Rendering (SSR)
- **Server Components**: Main pages and layouts are server-rendered for better SEO and performance
- **Client Components**: Interactive components are properly marked with `'use client'`
- **Static Generation**: Where possible, pages are statically generated for optimal performance

### ✅ State Management
- **TanStack Query**: Integrated for server state management and caching
- **React State**: Used for local component state
- **Server Actions**: Handle data mutations and form submissions

### ✅ Routing
- **App Router**: Using Next.js 13+ App Router for file-based routing
- **Dynamic Routes**: Support for parameterized routes (`/experiments/[id]`)
- **Loading States**: Proper loading UI for better UX

## File Structure

```
app/
├── layout.tsx                 # Root layout with SEO metadata
├── page.tsx                   # Home page (redirects to /experiments)
├── providers.tsx              # TanStack Query provider
├── globals.css                # Global styles
├── experiments/
│   ├── page.tsx              # Experiments list (SSR)
│   ├── loading.tsx           # Loading UI
│   ├── components/
│   │   ├── ExperimentForm.tsx    # Client component for form
│   │   ├── ExperimentList.tsx    # Server component for list
│   │   └── ExperimentCard.tsx    # Server component for cards
│   ├── actions/
│   │   └── experiment-actions.ts  # Server actions
│   └── [id]/
│       ├── page.tsx              # Individual experiment (SSR)
│       ├── loading.tsx          # Loading UI
│       └── components/
│           ├── ExperimentHeader.tsx
│           ├── ExperimentResults.tsx
│           ├── ResponseComparison.tsx
│           ├── ResponseDetails.tsx
│           └── MetricsAnalysis.tsx
└── api/
    └── generate/
        └── route.ts              # API routes
```

## Key Features

### 1. Server-Side Rendering
- **SEO Optimized**: All pages have proper metadata and Open Graph tags
- **Performance**: Server components reduce client-side JavaScript
- **Caching**: TanStack Query provides intelligent caching

### 2. State Management
- **Server State**: Managed by TanStack Query with automatic caching
- **Client State**: React useState for local component state
- **Form State**: Controlled components with proper validation

### 3. Routing & Navigation
- **File-based Routing**: Clean, intuitive route structure
- **Dynamic Routes**: Support for parameterized URLs
- **Loading States**: Proper loading UI for better UX

### 4. Data Flow
```
Server Actions → TanStack Query → React Components → UI
```

## Component Types

### Server Components (Default)
- **No `'use client'` directive**
- **Rendered on server**
- **Can access server resources directly**
- **Better for SEO and performance**

Examples:
- `app/experiments/page.tsx`
- `app/experiments/components/ExperimentList.tsx`
- `app/experiments/[id]/page.tsx`

### Client Components
- **Marked with `'use client'`**
- **Rendered on client**
- **Can use hooks and browser APIs**
- **Interactive functionality**

Examples:
- `app/experiments/components/ExperimentForm.tsx`
- `app/experiments/[id]/components/ExperimentResults.tsx`

## Performance Optimizations

### 1. Static Generation
- Pages are statically generated where possible
- Dynamic routes use ISR (Incremental Static Regeneration)

### 2. Code Splitting
- Automatic code splitting by route
- Dynamic imports for heavy components

### 3. Caching
- TanStack Query provides intelligent caching
- Server-side caching for API responses

### 4. SEO
- Comprehensive metadata for all pages
- Open Graph and Twitter Card support
- Structured data for better search visibility

## Development Guidelines

### 1. Server vs Client Components
- **Use Server Components by default**
- **Only use Client Components when you need:**
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - React hooks (useState, useEffect, etc.)
  - Third-party libraries that require client-side rendering

### 2. Data Fetching
- **Server Components**: Use direct database queries or API calls
- **Client Components**: Use TanStack Query for server state
- **Forms**: Use Server Actions for mutations

### 3. State Management
- **Server State**: TanStack Query for data from APIs
- **Client State**: React useState for local component state
- **Form State**: Controlled components with validation

## Benefits of This Architecture

1. **Better SEO**: Server-rendered content is immediately available to search engines
2. **Improved Performance**: Reduced client-side JavaScript and faster initial loads
3. **Better UX**: Proper loading states and error handling
4. **Maintainability**: Clear separation of concerns between server and client logic
5. **Scalability**: Efficient caching and state management
6. **Developer Experience**: Type-safe server actions and better debugging

## Next Steps

1. **Database Integration**: Replace mock data with real database
2. **Authentication**: Add user authentication and authorization
3. **Real-time Updates**: Implement WebSocket connections for live updates
4. **Testing**: Add comprehensive test coverage
5. **Monitoring**: Implement error tracking and performance monitoring
