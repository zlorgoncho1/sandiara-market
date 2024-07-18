import { type StripeGatewayId } from "./StripeElements/types";
import { type SenpayGatewayId } from "./SenPay/types";
import { type PaymentGatewayConfig } from "@/checkout/graphql";
import {
	type AdyenGatewayId,
	type AdyenGatewayInitializePayload,
} from "@/checkout/sections/PaymentSection/AdyenDropIn/types";

export type PaymentGatewayId = AdyenGatewayId | StripeGatewayId | SenpayGatewayId;

export type ParsedAdyenGateway = ParsedPaymentGateway<AdyenGatewayId, AdyenGatewayInitializePayload>;
export type ParsedStripeGateway = ParsedPaymentGateway<StripeGatewayId, {}>;
export type ParsedSenPayGateway = ParsedPaymentGateway<SenpayGatewayId, {}>;

export type ParsedPaymentGateways = ReadonlyArray<
	ParsedAdyenGateway | ParsedStripeGateway | ParsedSenPayGateway
>;

export interface ParsedPaymentGateway<ID extends string, TData extends Record<string, any>>
	extends Omit<PaymentGatewayConfig, "data" | "id"> {
	data: TData;
	id: ID;
}

export type PaymentStatus = "paidInFull" | "overpaid" | "none" | "authorized";
