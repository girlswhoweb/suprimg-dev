import { useFindFirst } from "@gadgetinc/react";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Form,
  Frame,
  Icon,
  InlineStack,
  Layout,
  Page,
  Select,
  // Spinner,
  Text,
  Toast,
} from "@shopify/polaris";
import { api } from "../api";
import { useEffect, useMemo, useState } from "react";
import HeaderCard from "../components/HeaderCard";
import DesignCard from "../components/DesignCard/index";
import OptimisationCard from "../components/OptimisationCard";
import SettingsCard from "../components/SettingsCard/index";
import PreviewCard from "../components/PreviewCard";
import { useI18n } from "@shopify/react-i18n";
import { ResetMinor, WandMinor } from "@shopify/polaris-icons";

import enTranslations from "../translations/en.json";
import Pricing from "../components/Pricing/index";
import { ConversationMinor, InviteMinor } from "@shopify/polaris-icons";
import { useGadget } from "@gadgetinc/react-shopify-app-bridge";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import HelpCard from "../components/HelpCard";
import { useCallback } from "react";
// import "../App.css";
// import FAQ from "../components/FAQ";
// import { useAppBridge } from "@shopify/app-bridge-react";

// const error = false;
// const fetching = true;
// const data = null;

const ShopPage = () => {
  const [{ data, fetching, error }] = useFindFirst(api.shopSettings);
  const { isAuthenticated, loading } = useGadget();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  
  const [language, _setLanguage] = useState(localStorage.getItem("supr-language") || "en");

  const [i18n] = useI18n({
    id: "AppData",
    fallback: enTranslations,
    translations: async function (locale) {
      try {
        // console.log("locale translations", locale);
        const dictionary = await import(`../translations/${locale}.json`);
        return dictionary.default;
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  // const [isMigrated, setIsMigrated] = useState(false);
  const [initLoad, setInitLoad] = useState(true);
  const [activating, setActivating] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [showCompletedBanner, setShowCompletedBanner] = useState(true);
  const [shopSettingsId, setShopSettingsId] = useState("");
  const [appSettings, setAppSettings] = useState({
    isSaved: true,
    markType: "text",
    opacity: 50,
    position: "center",
    radioValue: "allProducts"
  });
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDifferent, setIsDifferent] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [processStatus, setProcessStatus] = useState({
    state: "IDEL", // IDEL, PROCESSING, UPLOADING, REMOVING, FAILED, LIMITED, COMPLETED
    operationId: null,
    lastAction: null,
    processCount: 0,
  });
  const [toastData, setToastData] = useState({
    isActive: false,
    message: "",
    error: false,
  });

  async function saveSettings() {
    setToastData({ isActive: true, message: "Updating...", error: false });
    await api.shopSettings.update(shopSettingsId, {
      data: { ...appSettings, isSaved: true },
      isDifferent: true,
    });
    setIsDifferent(true);
    setAppSettings({...appSettings, isSaved: true});
    setToastData({ isActive: true, message: "Settings saved", error: false });
  }

  const setLanguage = (language) => {
    localStorage.setItem("supr-language", language);
    _setLanguage(language);
    window.location.reload();
  }

  useEffect(() => {
    if (!fetching) {
      if (data) {
        // setIsMigrated(data.isMigrated || true);
        setInitLoad(true);
        setIsActive(data.isActive);
        setIsDifferent(data.isDifferent);
        setAppSettings(data.data);
        setIsPaidUser(data.isPaidUser);
        setShopSettingsId(data.id);
        if(data.processStatus){
          setProcessStatus(data.processStatus);
        }
      }
    }
  }, [fetching]);

  useEffect(() => {
    if(processStatus && processStatus.state === "CHARGE"){
      window.open(processStatus.confirmationUrl, "_blank");
    }
  }, [processStatus]);

  // Check for status update every 5 seconds if processing
  useEffect(() => {
    if (fetching) return
    if (["PROCESSING", "REMOVING", "UPLOADING"].includes(processStatus?.state?.toUpperCase())) {
      const interval = setInterval(async () => {
        const shopData = await api.shopSettings.findByShopId(data._shopId);
        if(shopData.processStatus){
          setProcessStatus(shopData.processStatus);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [processStatus, fetching]);

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

  useEffect(() => {
    if (initLoad) {
      setInitLoad(false);
      return;
    }
    console.log("appSettings", appSettings?.isSaved);
    // if (appSettings?.isSaved !== true) {
    //   setShowSaveBar();
    // }
  }, [appSettings]);

  const onApply = async ({skipCharge = false}) => {
    await shopify.saveBar.leaveConfirmation();
    setToastData({
      isActive: true,
      message: `${i18n.translate("AppData.General.Updating")}...`,
      error: false,
    });
    if (skipCharge === false && isPaidUser !== true) {
      shopify.modal.show("accept-charge-model");
      return;
    }
    setActivating(true);
    try {
      await api.shopSettings.update(shopSettingsId, {
        isActive: true,
        activeData: appSettings,
        isDifferent: false,
      });
      setIsActive(true);
      setIsDifferent(false);
      setToastData({
        isActive: true,
        message: i18n.translate("AppData.General.Updated"),
        error: false,
      });
      setProcessStatus({
        state: "PROCESSING",
      });
    } catch (e) {
      setToastData({
        isActive: true,
        message: "Something went wrong. Please try again or contact support.",
        error: true,
      });
      setProcessStatus({
        state: "FAILED",
      });
    }
    setActivating(false);
  };

  const onRestore = async () => {
    setToastData({
      isActive: true,
      message: `${i18n.translate("AppData.General.Updating")}...`,
      error: false,
    });
    setRestoreLoading(true);
    try {
      await api.shopSettings.update(shopSettingsId, {
        isActive: false,
      });
      setIsActive(false);
      setToastData({
        isActive: true,
        message: i18n.translate("AppData.General.Updated"),
        error: false,
      });
      setProcessStatus({
        state: "REMOVING",
      });
    } catch (error) {
      setToastData({
        isActive: true,
        message: "Something went wrong. Please try again or contact support.",
        error: true,
      });
      setProcessStatus({
        state: "FAILED",
      });
    }
    setRestoreLoading(false);
  };


  const toastMarkup = toastData.isActive ? (
    <Toast
      content={toastData.message}
      error={toastData.error}
      onDismiss={() => setToastData({ isActive: false })}
      duration={2000}
    />
  ) : null;

  const handleSave = async() => {
    saveSettings();
  }
  
  const handleDiscard = () => {
    setAppSettings({ ...data.data, isSaved: true });
  }

  // return (
  //   <Page title="App Under Maintenance">
  //     <Text variant="bodyMd" as="p">
  //       We will be back soon!
  //     </Text>
  //   </Page>
  // );

  return (
    <Page
      title="Add Watermark & Optimise"
      backAction={{
        onAction: async () => {
          await shopify.saveBar.leaveConfirmation();
          navigate("/");
        }
      }}
      // primaryAction={{
      //   content: ["PROCESSING", "UPLOADING"].includes(processStatus?.state?.toUpperCase()) ? `${i18n.translate("AppData.HeaderCard.processing")}...` : i18n.translate("AppData.HeaderCard.apply"),
      //   icon: <Icon source={WandMinor} />,
      //   loading: activating,
      //   disabled: ["PROCESSING"].includes(processStatus?.state?.toUpperCase()),
      //   onAction: onApply
      // }}
      secondaryActions={[
        {
          content: ["REMOVING"].includes(processStatus?.state?.toUpperCase()) ? `${i18n.translate("AppData.HeaderCard.restoring")}...` : i18n.translate("AppData.HeaderCard.restore"),
          icon: ResetMinor,
          loading: restoreLoading,
          disabled: ["PROCESSING", "REMOVING"].includes(processStatus?.state?.toUpperCase()),
          destructive: true,
          onAction: onRestore
        }
      ]}
    >
      <style>
        {`
          .preview-empty > div {
            padding: 10px 0 0 0 !important;
          }
          .d-blocked{
            pointer-events: none;
            opacity: 0.5;
          }
        `}
      </style>
      <Frame>
        <div className={`cls-loading-wrapper ${!loading && appSettings ? 'loaded' : ''}`}  style={(loading || fetching || !appSettings) ? { opacity: 0.5, pointerEvents: "none" } : { opacity: 1 }}>
          <div className="cls-container">
          <Layout>
            {/* Header Section */}
            {processStatus?.state?.toUpperCase() === "LIMITED" && <Layout.Section>
              <Banner tone="success">
                {i18n.translate("AppData.HeaderCard.limitedMsg")}
              </Banner>
            </Layout.Section>}
            {processStatus?.state?.toUpperCase() === "FAILED" && <Layout.Section>
              <Banner tone="critical">
                {i18n.translate("AppData.HeaderCard.failedMsg")}
              </Banner>
            </Layout.Section>}
            {processStatus?.state?.toUpperCase() === "COMPLETED" && showCompletedBanner && 
              <Layout.Section>
                <Banner tone="success" title={i18n.translate("AppData.HeaderCard.completedSuccessfully")} onDismiss={() => setShowCompletedBanner(false)}>
                  {i18n.translate("AppData.HeaderCard.completedMsg")}
                  {processStatus.updatedAt &&
                    `${i18n.translate(
                      "AppData.HeaderCard.lastUpdated"
                    )} ${new Date(
                      processStatus.updatedAt
                    ).toLocaleString()}`}
                </Banner>
              </Layout.Section>
            }
            <HeaderCard
              shopSettingsId={shopSettingsId}
              isPaidUser={isPaidUser}
              isDifferent={isDifferent}
              setIsDifferent={setIsDifferent}
              isActive={isActive}
              setIsActive={setIsActive}
              setToastData={setToastData}
              appSettings={appSettings}
              setShowPricing={setShowPricing}
              processStatus={processStatus}
              setProcessStatus={setProcessStatus}
              loading={loading || !appSettings}
            />
            <SaveBar id="save-settings" open={appSettings?.isSaved !== true}>
              <button variant="primary" onClick={handleSave}>Save & Preview</button>
              <button onClick={handleDiscard}>Discard</button>
            </SaveBar>
            {/* Main Section */}
            <Layout.Section>
              <Layout fullWidth>
                <Layout.Section>
                  <div className="quik-tabs">
                    <div style={{ marginBottom: "var(--p-space-400)" }}>
                      <Card>
                        <InlineStack align="space-between" blockAlign="center" wrap={false} gap="400">
                          <BlockStack>
                            <Text as="h2" variant="headingMd">Start Processing 👉</Text>
                            <Text as="h3" variant="bodyMd" tone="subdued">Note: This will start the task to process your images, if you just want to save the preview, click on "Save" after making your changes</Text>
                          </BlockStack>
                          <BlockStack>
                            <Button variant="primary" onClick={onApply} icon={WandMinor} loading={activating} disabled={["PROCESSING", "REMOVING"].includes(processStatus?.state?.toUpperCase())}>{processStatus?.state?.toUpperCase() === "PROCESSING" ? `${i18n.translate("AppData.HeaderCard.processing")}...` : i18n.translate("AppData.HeaderCard.apply")}</Button>
                          </BlockStack>
                        </InlineStack>
                      </Card>
                    </div>
                    <BlockStack gap={400}>
                      <DesignCard
                        appSettings={appSettings}
                        setAppSettings={setAppSettings}
                        setToastData={setToastData}
                        shopUrl={data?.shopUrl}
                      />
                      <OptimisationCard
                        appSettings={appSettings}
                        setAppSettings={setAppSettings}
                      />
                    </BlockStack>
                  </div>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  <div
                    className="preview-panel"
                    style={{ marginBottom: "var(--p-space-400)" }}
                  >
                    <PreviewCard
                      appSettings={appSettings}
                      setAppSettings={setAppSettings}
                    />
                  </div>
                  <SettingsCard
                    appSettings={appSettings}
                    setAppSettings={setAppSettings}
                    setToastData={setToastData}
                  />
                  <div
                    style={{ marginTop: "var(--p-space-400)" }}
                  >
                    <Card>
                      <Select
                        label="Language"
                        options={[
                          {label: "English", value: "en"},
                          {label: "Danish", value: "da"},
                          {label: "German", value: "de"},
                          {label: "French", value: "fr"},
                          {label: "Spanish", value: "es"},
                          {label: "Chinese (Simplified)", value: "zh-CN"}
                        ]}
                        onChange={(value) => setLanguage(value)}
                        value={language}
                      />
                    </Card>
                  </div>
                </Layout.Section>
              </Layout>
            </Layout.Section>
            {/* FAQ Section */}
            {/* <Layout.Section>
              <FAQ />
            </Layout.Section> */}
            {/* Help Section */}
            <Layout.Section>
              <HelpCard />
            </Layout.Section>
            <Layout.Section></Layout.Section>
          </Layout>
          <Pricing open={showPricing} />
        </div>
        </div>
        {toastMarkup}
      </Frame>
    </Page>
  );
};

export default ShopPage;
