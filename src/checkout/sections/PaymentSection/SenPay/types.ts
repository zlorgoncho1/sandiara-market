import { type ParsedSenPayGateway } from "../types";

export const senpayGatewayId = "senpay.saleor.app";
export type SenpayGatewayId = typeof senpayGatewayId;

export interface SenPayProps {
	config: ParsedSenPayGateway;
}
