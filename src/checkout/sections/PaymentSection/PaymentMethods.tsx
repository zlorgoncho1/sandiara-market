import React, { useState, useEffect } from "react";
import { paymentMethodToComponent } from "./supportedPaymentApps";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";

export const PaymentMethods = () => {
	const { availablePaymentGateways, fetching } = usePayments();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

	useEffect(() => {
		if (availablePaymentGateways.length > 0 && !selectedPaymentMethod) {
			setSelectedPaymentMethod(availablePaymentGateways[0].id);
		}
	}, [availablePaymentGateways, selectedPaymentMethod]);

	if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	if (!availablePaymentGateways.length) {
		return <div>No payment methods available</div>;
	}

	return (
		<div className="gap-y-8">
			<div className="mb-4 flex">
				{availablePaymentGateways.map((gateway) => (
					<button
						key={gateway.id}
						onClick={() => setSelectedPaymentMethod(gateway.id)}
						className={`border-b-2 px-4 py-2 ${
							selectedPaymentMethod === gateway.id ? "border-blue-500 font-medium" : "border-transparent"
						}`}
					>
						{gateway.id === "senpay.saleor.app" ? "Mobile Money" : "VISA"}
					</button>
				))}
			</div>
			{availablePaymentGateways.map((gateway) => {
				if (gateway.id === selectedPaymentMethod) {
					const Component = paymentMethodToComponent[gateway.id];
					return (
						<Component
							key={gateway.id}
							// @ts-expect-error -- gateway matches the id but TypeScript doesn't know that
							config={gateway}
						/>
					);
				}
				return null;
			})}
		</div>
	);
};
