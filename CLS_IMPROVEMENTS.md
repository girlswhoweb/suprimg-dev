# CLS (Cumulative Layout Shift) Improvements

This document outlines the changes made to reduce CLS in the SuprImg Shopify app.

## Overview

Cumulative Layout Shift (CLS) measures visual stability by quantifying how much page content shifts during the loading process. A good CLS score is less than 0.1.

## Improvements Made

### 1. **Stable Loading States**
- Added consistent skeleton components that match the final layout dimensions
- Implemented stable loading wrappers that prevent opacity/visibility changes from causing shifts
- Added minimum loading times to prevent rapid flickering

### 2. **Reserved Space for Dynamic Content**
- **Banners**: Added `cls-banner-container` with `min-height: 60px` to reserve space for success/error banners
- **Images**: Created `cls-image-container` with fixed dimensions (250px height) for preview images
- **Cards**: Added `cls-card-container` with layout containment

### 3. **CSS Containment**
- Added `contain: layout` and `contain: layout style` to prevent layout calculations from affecting parent elements
- Used CSS containment on key containers to isolate layout changes

### 4. **Image Loading Improvements**
- Added fixed aspect ratio containers for images
- Implemented `loading="lazy"` for non-critical images
- Added stable image dimensions with max-width/max-height constraints
- Added opacity transitions for smooth image loading

### 5. **Performance Monitoring**
- Added `PerformanceMonitor` component to track CLS scores
- Integrated web-vitals library for real-time CLS monitoring
- Added console warnings when CLS thresholds are exceeded

### 6. **Layout Structure Improvements**
- Wrapped page content in `cls-container` for consistent layout behavior
- Prevented SaveBar from causing layout shifts with transition overrides
- Added stable font loading with `font-display: swap`

## Key CSS Classes

```css
.cls-container - Main container with layout containment
.cls-banner-container - Reserved space for dynamic banners
.cls-image-container - Fixed dimensions for images
.cls-card-container - Layout containment for cards
.cls-loading-wrapper - Smooth loading transitions
.cls-skeleton-container - Stable skeleton layouts
```

## Measurement & Monitoring

The app now includes:
- Real-time CLS monitoring in development mode
- Console logging of web vitals metrics
- Custom thresholds for performance alerts
- Integration points for analytics services

## Best Practices Implemented

1. **Reserve space for dynamic content** - All conditional content now has reserved space
2. **Use consistent dimensions** - Images and dynamic elements have stable containers
3. **Avoid layout-affecting properties** - Prevented changes to layout-affecting CSS properties
4. **Implement proper loading states** - Skeleton components match final layout dimensions
5. **Monitor and measure** - Continuous CLS monitoring to catch regressions

## Expected Results

These changes should significantly reduce CLS by:
- Eliminating unexpected layout shifts during loading
- Providing stable dimensions for all dynamic content
- Smooth transitions instead of jarring content jumps
- Better loading state management

## Testing

To test CLS improvements:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run a performance audit
4. Check the CLS score in the Web Vitals section
5. Monitor the console for real-time CLS measurements

Target CLS score: < 0.1 (Good)
