import React from 'react';
import {
  SkeletonPage,
  Layout,
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  BlockStack,
  Box,
  InlineStack,
} from '@shopify/polaris';

// This component matches the actual layout structure of ShopPage.jsx
export const ShopPageSkeleton = () => {
  return (
    <div className="cls-skeleton-container">
      <SkeletonPage primaryAction>
        <BlockStack gap="600">
          {/* Reserve space for banners */}
          <div className="cls-banner-container" style={{ minHeight: '60px' }}>
            {/* Banner placeholder */}
          </div>
          
          {/* Header Card Skeleton */}
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Box>
                  <SkeletonDisplayText size="medium" />
                </Box>
                <InlineStack gap="300">
                  <Box height="36px" background="bg-surface-active" borderRadius="100" />
                  <Box height="36px" background="bg-surface-active" borderRadius="100" />
                </InlineStack>
              </InlineStack>
              <Box paddingBlockStart="200">
                <SkeletonBodyText lines={2} />
              </Box>
              <Box paddingBlockStart="200">
                <InlineStack wrap={false} gap="200" align="start">
                  <Box height="36px" background="bg-surface-active" borderRadius="100" />
                  <Box height="36px" background="bg-surface-active" borderRadius="100" />
                </InlineStack>
              </Box>
            </BlockStack>
          </Card>

        <Layout>
          <Layout.Section>
            {/* Design Card Skeleton */}
            <Card>
              <BlockStack gap="400">
                <Box>
                  <SkeletonDisplayText size="small" />
                </Box>
                <Box paddingBlockStart="200">
                  <SkeletonBodyText lines={3} />
                </Box>
                <Box paddingBlockEnd="200">
                  <SkeletonDisplayText size="small" />
                </Box>
                <Box paddingBlockEnd="200" minHeight="100px" background="bg-surface-secondary" borderRadius="200" />
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section secondary>
            <BlockStack gap="400">
              {/* Preview Card Skeleton */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack columns="1fr auto">
                    <SkeletonDisplayText size="small" />
                    <Box height="30px" background="bg-surface-active" borderRadius="100" />
                  </InlineStack>
                  <Box paddingBlockStart="200">
                    <SkeletonBodyText lines={1} />
                  </Box>
                  <Box paddingBlockStart="200">
                    <SkeletonBodyText lines={1} />
                  </Box>
                  <Box paddingBlockStart="400" minHeight="250px" background="bg-surface-secondary" borderRadius="200" />
                </BlockStack>
              </Card>

              {/* Optimization Card Skeleton */}
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                  <Box paddingBlock="200">
                    <SkeletonBodyText lines={1} />
                  </Box>
                </BlockStack>
              </Card>
              
              {/* Settings Card Skeleton */}
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </BlockStack>
              </Card>

              {/* Help Card Skeleton */}
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                  <Box paddingBlockStart="200">
                    <InlineStack wrap={false} gap="200" align="start">
                      <Box height="36px" background="bg-surface-active" borderRadius="100" />
                      <Box height="36px" background="bg-surface-active" borderRadius="100" />
                    </InlineStack>
                  </Box>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
      </SkeletonPage>
    </div>
  );
};

export const WelcomePageSkeleton = () => {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <Card padding="400">
            <BlockStack gap="200">
              <SkeletonDisplayText size="large" />
              <SkeletonBodyText lines={1} />
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card padding="400">
            <BlockStack gap="400">
              <BlockStack>
                <SkeletonDisplayText size="medium" />
                <SkeletonBodyText lines={3} />
              </BlockStack>
              <InlineStack align="start">
                <Box paddingBlockEnd="200" paddingInlineEnd="200" minWidth="100px" minHeight="40px" background="bg-surface-active" borderRadius="100" />
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card padding="400">
            <BlockStack gap="400">
              <Box paddingBlockEnd="100">
                <SkeletonDisplayText size="small" />
              </Box>
              <Box paddingBlockEnd="400">
                <SkeletonBodyText lines={2} />
              </Box>
              <Box paddingBlockEnd="100" minWidth="150px" minHeight="40px" background="bg-surface-active" borderRadius="100" />
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card padding="400">
            <BlockStack gap="200">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}; 