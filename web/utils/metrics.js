import { onLCP, onCLS, onFCP, onTTFB } from 'web-vitals';
import { api } from '../api';

/**
 * Initializes performance metric tracking for Core Web Vitals
 * @param {Object} options Configuration options
 * @param {boolean} options.sendToBackend Whether to send metrics to backend
 * @param {boolean} options.logToConsole Whether to log metrics to console
 */
export function initMetrics({ 
  sendToBackend = false, 
  logToConsole = true
} = {}) {
  const reportMetric = (name, metric) => {
    const data = {
      name: name,
      value: Math.round(metric.value), // Round to the nearest integer for easier reading
      id: metric.id,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    // Log to console if enabled
    if (logToConsole) {
      console.log(`Web Vital: ${name}`, data);
    }

    // Send to backend if enabled
    if (sendToBackend) {
      // You could create a Gadget action for this or use another analytics service
      // api.metricEvents.create({ data }).catch(err => console.error('Failed to log metric:', err));
      console.log('Sending metric to backend (disabled for now):', data);
    }

    // You could also send to Google Analytics, Mixpanel, etc.
  };

  // Monitor LCP - Largest Contentful Paint
  onLCP(metric => reportMetric('LCP', metric));
    
  // Monitor CLS - Cumulative Layout Shift
  onCLS(metric => reportMetric('CLS', metric));
  
  // Monitor FCP - First Contentful Paint
  onFCP(metric => reportMetric('FCP', metric));
  
  // Monitor TTFB - Time to First Byte
  onTTFB(metric => reportMetric('TTFB', metric));
}

/**
 * Returns a color-coded status for a Core Web Vitals metric
 * @param {string} name The metric name (LCP, FID, CLS)
 * @param {number} value The metric value
 * @returns {'good'|'needs-improvement'|'poor'} The status
 */
export function getMetricStatus(name, value) {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'unknown';
  }
} 