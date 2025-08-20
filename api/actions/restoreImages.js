import { Lambda } from "@aws-sdk/client-lambda";
import { RestoreImagesGlobalActionContext } from "gadget-server";
import { v4 as uuidv4 } from "uuid";

/**
 * @param { RestoreImagesGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { shopUrl } = params;
  const shopSettings = await api.shopSettings.findByShopUrl(shopUrl);
  if (!shopSettings) return;

  // /** @type {[import("@gadget-client/suprimg").MarkedImages]} */
  // let images = [];
  // async function getImages({ cursor, filter }) {
  //   let localImages = await api.processedImages.findMany({
  //     first: 250,
  //     filter: filter || {},
  //     after: cursor || "",
  //     select: {
  //       id: true,
  //       mediaId: true,
  //       processedKey: true,
  //       productId: true,
  //     }
  //   });
  //   images = images.concat(localImages);
  //   if (localImages.hasNextPage) {
  //     await getImages({
  //       cursor: localImages.endCursor,
  //       filter: filter || {},
  //     });
  //   }
  // }

  // await getImages({ filter: {
  //   shopId: { equals: shopSettings._shopId },
  //   // isMarked: { equals: true },
  // }})

  // images.forEach(async (image) => {
  //   if (!image.mediaId) return;
  //   if (image.processedKey.includes("original")) {
  //     console.log("image update", image);
  //     await api.processedImages.update(image.id.toString(), {
  //       processedKey: `9c7fc6-2.myshopify.com/images/${image.mediaId.replace("gid://shopify/MediaImage/", "")}.webp`
  //     });
  //   }
  // });
  
  // return
  // Restore all the product images
  const operationId = uuidv4();
  console.log("operationId", operationId);
  await api.shopSettings.update(shopSettings.id, {
    processStatus: {
      state: "REMOVING",
      operationId: operationId,
    }
  })

  // Trigger the lambda function to remove all the images
  const lambdaClient = new Lambda({ 
    region: "us-east-1" ,
    credentials: {
      accessKeyId: "vMu4mZQkrhKBLgerVIYu7s7dUCLY9G1+lE4u+EAQ",
      secretAccessKey: "vMu4mZQkrhKBLgerVIYu7s7dUCLY9G1+lE4u+EAQ"
    }
  });
  lambdaClient.invoke({
    FunctionName: "watermark-remove",
    InvocationType: "Event",
    Payload: JSON.stringify({
      operationId: operationId,
      shopId: shopSettings._shopId,
      shopUrl: shopSettings.shopUrl,
    })
  }, (err, data) => {
    if (err) {
      console.log("err", err);
    } else {
      console.log("data", data);
    }
  })
};



export const params = {
  shopUrl: {
    type: "string"
  },
};

export const options = { triggers: { api: true } }