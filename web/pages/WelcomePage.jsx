import { useGadget } from "@gadgetinc/react-shopify-app-bridge";
import { useFindFirst } from "@gadgetinc/react";
import { Banner, BlockStack, Button, CalloutCard, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { Onboarding } from "../components/Onboarding";
import HelpCard from "../components/HelpCard";
import StatsCard from "../components/StatsCard";
import { api } from "../api";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { appBridge } = useGadget();
  const [{ data: shopData, fetching: fetchingShop, error: shopError }] = useFindFirst(api.shopifyShop, {
    select: {
      id: true,
      markedImagesCount: true
    }
  });

  // To add Tidio Chat
  // useEffect(() => {
  //   const script = document.createElement('script');
  
  //   script.src = "//code.tidio.co/fbsoxxoxjjvlny3tz1bvris8kpq75z8r.js";
  //   script.async = true;
  
  //   document.body.appendChild(script);
  
  //   return () => {
  //     document.body.removeChild(script);
  //   }
  // }, []);

  const handleClick = () => {
    const shopUrl = appBridge.config.shop;
    const url = `https://${shopUrl}/admin/themes/current/editor?context=apps`;
    window.open(url, "_blank");
  }

  return (
    <Page narrowWidth>
      <div className="cls-container">
        <Layout>
          <Layout.Section>
            <Card padding="400">
              <BlockStack>
                <Text variant="headingXl">Welcome 👋</Text>
                <Text variant="bodyLg">SuprImg: Anti-theft Watermark</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          {/* Reserve space for banner to prevent layout shift */}
          <div className="cls-banner-container">
            {shopData?.markedImagesCount >= 10 && (
              <Layout.Section>
                <Banner title="Enjoying SuprImg?" tone="success">
                  <p>
                    You've protected {shopData.markedImagesCount} images with SuprImg! If you're finding our app helpful, 
                    we'd greatly appreciate if you could leave a review.
                  </p>
                  <BlockStack gap="300">
                    <div style={{marginTop: "10px"}}>
                      <Button 
                        onClick={() => {
                          window.open("https://apps.shopify.com/suprimg-anti-theft-watermark/reviews", "_blank");
                        }}
                        variant="primary"
                      >
                        Leave a Review
                      </Button>
                    </div>
                  </BlockStack>
                </Banner>
              </Layout.Section>
            )}
          </div>
        <Layout.Section>
          <BlockStack gap="400">
            <Onboarding />
            <StatsCard />
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <CalloutCard
            title="Ready to protect your store?"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: 'Enable Extensions',
              // url: '#',
              onAction: handleClick
            }}
          >
            <p>Enable our extension to disable right click, text selection and the developer console.</p>
          </CalloutCard>
        </Layout.Section>
        <Layout.Section>
          <Card padding="400">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text variant="headingMd">Add Watermark & Optimise</Text>
                <Text variant="bodyMd" tone="subdued">Add logo or text watermark to protect your store & optimise page load time with image compression.</Text>
              </BlockStack>
              <InlineStack align="start" blockAlign="start">
                <Button onClick={() => navigate("/watermark")} variant="primary" size="large">Add Watermark & Optimise</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        {/* <Layout.Section>
          <Card padding="400">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text variant="headingMd">Step 2: Disable Right Click</Text>
                <Text variant="bodyMd" tone="subdued">This will prevent users from right clicking on your images to copy or download.</Text>
              </BlockStack>
              <InlineStack align="start" blockAlign="start" gap="200">
                <Button onClick={() => handleClick("disable-right-click")} variant="primary" size="large">Disable Right Click</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section> */}
        {/* <Layout.Section>
          <Card padding="400">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text variant="headingMd">Step 3: Disable Text Copy</Text>
                <Text variant="bodyMd" tone="subdued">This will prevent users from copying text from your images.</Text>
              </BlockStack>
              <InlineStack align="start" blockAlign="start" gap="200">
                <Button onClick={() => handleClick("disable-text-selection")} variant="primary" size="large">Disable Text Copy</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section> */}
        {/* <Layout.Section>
          <Card padding="400">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text variant="headingMd">Step 4: Disable Dev Panel</Text>
                <Text variant="bodyMd" tone="subdued">This will prevent users from using the browser's developer tools to inspect your images.</Text>
              </BlockStack>
              <InlineStack align="start" blockAlign="start" gap="200">
                <Button onClick={() => handleClick("disable-dev-console")} variant="primary" size="large">Disable Dev Panel</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section> */}
        <Layout.Section><HelpCard /></Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
      </div>
    </Page>
  )
}