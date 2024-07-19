/* eslint-disable no-restricted-imports */
import Image from "next/image";
/* eslint-enable no-restricted-imports */
import { type FC, useMemo } from "react";
import { type SenPayProps } from "./types";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { Button } from "@/checkout/components";

const paymentGatewayIcons = [
	{
		url: "/orange_logo.png",
		name: "ORANGE",
	},
	{
		url: "/wave_logo.png",
		name: "WAVE",
	},
];

export const SenPayComponent: FC<SenPayProps> = ({ config }) => {
	const {
		checkout: { id: checkoutId, totalPrice, availablePaymentGateways, lines },
	} = useCheckout();

	const firstMatchingGateway = useMemo(() => {
		return availablePaymentGateways.find((pg) => pg.id === config.id);
	}, [availablePaymentGateways, config.id]);

	const handleProceed = () => {
		// Add your proceed logic here
		console.log("Proceed button clicked");
	};

	return (
		<div className="container mx-auto my-4 rounded-lg border bg-white p-4 shadow-md">
			<div className="mb-2 text-xl font-bold">{firstMatchingGateway?.name}</div>

			{/* Section for showing payment gateway icons */}
			<div className="mb-4 p-4">
				<div className="flex items-center justify-center space-x-4">
					{paymentGatewayIcons.map((method, idx) => (
						<div
							key={idx}
							className="flex h-20 w-20 flex-col items-center justify-center rounded-full p-2 shadow-md"
						>
							<Image src={method.url} alt={method.name} width={50} height={50} />
						</div>
					))}
				</div>
			</div>

			<div className="">
				<h2 className="text-lg font-semibold">Payment Configuration</h2>
				<p className="text-gray-700">ID: {config.id.slice(0, 10)}...</p>
				<p className="text-gray-700">Data: {JSON.stringify(config.data)}</p>
				{config.errors &&
					config.errors.map((error, idx) => (
						<div className="my-2 rounded-md bg-red-100 p-2" key={idx}>
							<p className="font-medium text-red-700">Error {idx + 1}:</p>
							<p className="text-red-700">Code: {error.code}</p>
							<p className="text-red-700">Field: {error.field}</p>
							<p className="text-red-700">Message: {error.message}</p>
						</div>
					))}
			</div>

			<div className="mb-4 rounded-lg bg-yellow-50 p-4">
				<h2 className="text-lg font-semibold">Checkout Information</h2>
				<p className="text-gray-700">Checkout ID: {checkoutId.slice(0, 10)}...</p>
				<p className="text-gray-700">Total Price: ${totalPrice.gross.amount}</p>
				<div className="mt-4">
					<h2 className="mb-2 text-lg font-semibold">Order Lines</h2>
					{lines.map((line) => (
						<div key={line.id} className="my-2 rounded-lg bg-gray-200 p-4 shadow-sm">
							<h3 className="font-semibold">Product Information</h3>
							<p className="text-gray-700">ID: {line.id.slice(0, 10)}...</p>
							<p className="text-gray-700">Variant: {line.variant.name}</p>
							<p className="text-gray-700">Product: {line.variant.product.name}</p>
							<p className="text-gray-700">Quantity: {line.quantity}</p>
							<p className="text-gray-700">Total Price: ${line.totalPrice.gross.amount}</p>
						</div>
					))}
				</div>
			</div>

			<div className="mt-4 flex justify-end">
				<Button
					label="Proceder"
					onClick={handleProceed}
					className="rounded-md px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
				>
					Proceed
				</Button>
			</div>
		</div>
	);
};
