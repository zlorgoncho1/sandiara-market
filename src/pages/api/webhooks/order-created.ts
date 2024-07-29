import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  OrderCreatedWebhookPayloadFragment,
  UntypedOrderCreatedDocument,
} from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";
import { createClient } from "../../../lib/create-graphq-client";
import { createTransaction } from "@/services/create-transaction";

/**
 * Create abstract Webhook. It decorates handler and performs security checks under the hood.
 *
 * orderCreatedWebhook.getWebhookManifest() must be called in api/manifest too!
 */
export const orderCreatedWebhook = new SaleorAsyncWebhook<OrderCreatedWebhookPayloadFragment>({
  name: "Order Created in Saleor",
  webhookPath: "/api/webhooks/order-created",
  event: "ORDER_CREATED",
  apl: saleorApp.apl,
  query: UntypedOrderCreatedDocument,
});

/**
 * Export decorated Next.js handler, which adds extra context
 */
export default orderCreatedWebhook.createHandler(async (req, res, ctx) => {
  const {
    /**
     * Access payload from Saleor - defined above
     */
    payload,
    /**
     * Saleor event that triggers the webhook (here - ORDER_CREATED)
     */
    event,
    /**
     * App's URL
     */
    baseUrl,
    /**
     * Auth data (from APL) - contains token and saleorApiUrl that can be used to construct graphQL client
     */
    authData,
  } = ctx;

  /**
   * Perform logic based on Saleor Event payload
   */
  console.log(`Order was created for customer: ${payload.order?.userEmail}`);

  /**
   * Create GraphQL client to interact with Saleor API.
   */
  const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

  /**
   * Now you can fetch additional data using urql.
   * https://formidable.com/open-source/urql/docs/api/core/#clientquery
   */

  // const data = await client.query().toPromise()

  try {
    const transaction = await createTransaction(
      {
        orderId: payload.order?.id,
        amount: payload.order?.total.gross.amount,
        currency: payload.order?.total.gross.currency,
        externalUrl: `${process.env.APP_IFRAME_BASE_URL}/checkout/${payload.order?.id}?saleorDomain=${authData.domain}`,
        pspReference: "psp" + payload.order?.id,
      },
      client
    );

    console.log(transaction);
  } catch (error) {
    console.error("Error creating transaction", error);
  }

  /**
   * Inform Saleor that webhook was delivered properly.
   */
  return res.status(200).end();
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
