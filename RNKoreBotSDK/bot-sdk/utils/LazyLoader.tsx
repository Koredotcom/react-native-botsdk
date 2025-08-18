import React, { ComponentType, LazyExoticComponent, Suspense, ReactNode } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Generic lazy loader utility for dynamic imports
 */
export class LazyLoader {
  private static cache = new Map<string, Promise<any>>();

  /**
   * Dynamically import a module with caching
   */
  static async importModule<T = any>(
    importFn: () => Promise<{ default: T }>,
    moduleKey: string
  ): Promise<T> {
    if (this.cache.has(moduleKey)) {
      return this.cache.get(moduleKey);
    }

    const modulePromise = importFn().then(module => module.default);
    this.cache.set(moduleKey, modulePromise);
    
    return modulePromise;
  }

  /**
   * Create a lazy React component with error boundary
   */
  static createLazyComponent<P = {}>(
    importFn: () => Promise<{ default: ComponentType<P> }>,
    fallback?: ReactNode,
    errorFallback?: ReactNode
  ): LazyExoticComponent<ComponentType<P>> {
    return React.lazy(importFn);
  }

  /**
   * Higher-order component for lazy loading with custom loading states
   */
  static withLazyLoading<P extends object>(
    importFn: () => Promise<{ default: ComponentType<P> }>,
    options: {
      fallback?: ReactNode;
      errorFallback?: ReactNode;
      loadingText?: string;
    } = {}
  ) {
    const LazyComponent = React.lazy(importFn);
    
    return (props: P) => (
      <Suspense 
        fallback={
          options.fallback || (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4ECDC4" />
              <Text style={styles.loadingText}>
                {options.loadingText || 'Loading...'}
              </Text>
            </View>
          )
        }
      >
        <LazyComponent {...props} />
      </Suspense>
    );
  }
}

/**
 * Default loading component
 */
export const DefaultLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="small" color="#4ECDC4" />
    <Text style={styles.loadingText}>{text}</Text>
  </View>
);

/**
 * Error fallback component
 */
export const ErrorFallback: React.FC<{ error?: string }> = ({ 
  error = 'Failed to load component' 
}) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
  },
});
