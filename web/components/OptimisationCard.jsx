import {
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  RangeSlider,
  Text,
} from "@shopify/polaris";
import { useI18n } from "@shopify/react-i18n";
import { useState } from "react";

export default function OptimisationCard({ appSettings, setAppSettings }) {
  const [localOptimisation, setLocalOptimisation] = useState(50);

  const [i18n] = useI18n({ id: "AppData"});

  return (
    <Card padding="0">
      <Box padding="400">
        <Checkbox
          label={<Text variant="headingLg">{i18n.translate("AppData.OptimisationCard.title")}</Text>}
          checked={appSettings?.optimisationEnabled}
          onChange={() =>
            setAppSettings({
              ...appSettings,
              optimisationEnabled: !appSettings?.optimisationEnabled,
            })
          }
        />
      </Box>
      <Divider />
      <div className={appSettings?.optimisationEnabled ? "" : "d-blocked"}>
        <Box padding="400">
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm" fontWeight="medium">
              {i18n.translate("AppData.OptimisationCard.compression") + " %"}
            </Text>
            <RangeSlider
              // label={i18n.translate("AppData.OptimisationCard.compression") + " %"}
              min={0}
              max={100}
              value={appSettings?.compression}
              onChange={(val) =>
                setAppSettings({
                  ...appSettings,
                  isSaved: false,
                  compression: val,
                })
              }
              onBlur={(e) =>
                setAppSettings({
                  ...appSettings,
                  isSaved: false,
                  compression: e.target.value,
                })
              }
              output
              prefix={i18n.translate("AppData.OptimisationCard.min")}
              suffix={i18n.translate("AppData.OptimisationCard.max")}
            />
            <BlockStack inlineAlign="start">
              <Button
                onAction={() =>
                  setAppSettings({
                    ...appSettings,
                    compression: 35,
                    isSaved: false,
                  })
                }
              >
                {i18n.translate("AppData.OptimisationCard.setToDefault")}
              </Button>
            </BlockStack>
          </BlockStack>
        </Box>
        {/* <RangeSlider
          label={i18n.translate("AppData.OptimisationCard.compression") + " %"}
          min={0}
          max={100}
          value={appSettings?.compression}
          onChange={(val) =>
            setAppSettings({
              ...appSettings,
              isSaved: false,
              compression: val,
            })
          }
          onBlur={(e) =>
            setAppSettings({
              ...appSettings,
              isSaved: false,
              compression: e.target.value,
            })
          }
          output
          prefix={i18n.translate("AppData.OptimisationCard.min")}
          suffix={i18n.translate("AppData.OptimisationCard.max")}
        /> */}
        {/* <div style={{ marginTop: "10px" }}>
          <Button
            onAction={() =>
              setAppSettings({
                ...appSettings,
                compression: 35,
                isSaved: false,
              })
            }
          >
            {i18n.translate("AppData.OptimisationCard.setToDefault")}
          </Button>
        </div> */}
      </div>
    </Card>
  );
}
