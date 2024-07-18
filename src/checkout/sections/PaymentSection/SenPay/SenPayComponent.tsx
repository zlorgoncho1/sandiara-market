import { type FC, useMemo } from "react";
import { type SenPayProps } from "./types";
import { useCheckout } from "@/checkout/hooks/useCheckout";

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
			<div className="mb-2 text-lg font-bold text-blue-600">{firstMatchingGateway?.name}</div>
			<div className="mb-4 rounded-lg bg-gray-100 p-4">
				<h2 className="text-md font-semibold">Payment Configuration</h2>
				<p className="text-gray-700">ID: {config.id.slice(0, 10)}...</p>
				<p className="text-gray-700">Data: {JSON.stringify(config.data)}</p>
				{config.errors &&
					config.errors.map((error, idx) => (
						<div className="bg-red-100" key={idx}>
							<p className="rounded-md p-1 text-red-700">code: {error.code}</p>
							<p className="rounded-md p-1 text-red-700">field: {error.field}</p>
							<p className="rounded-md p-1 text-red-700">message:{error.message}</p>
						</div>
					))}
			</div>
			<div className="mb-4 rounded-lg bg-yellow-50 p-4">
				<h2 className="text-md font-semibold">Checkout Information</h2>
				<p className="text-gray-700">Checkout ID: {checkoutId.slice(0, 10)}...</p>
				<p className="text-gray-700">Total Price: {totalPrice.gross.amount}</p>
				<div className="mt-4">
					<h2 className="text-md mb-2 font-semibold">Order Lines</h2>
					{lines.map((line) => (
						<div key={line.id} className="my-2 rounded-lg bg-gray-200 p-4 shadow-sm">
							<h3 className="font-semibold">Product Information</h3>
							<p className="text-gray-700">ID: {line.id.slice(0, 10)}...</p>
							<p className="text-gray-700">Variant: {line.variant.name}</p>
							<p className="text-gray-700">Product: {line.variant.product.name}</p>
							<p className="text-gray-700">Quantity: {line.quantity}</p>
							<p className="text-gray-700">Total Price: {line.totalPrice.gross.amount}</p>
						</div>
					))}
				</div>
			</div>
			<div className="mt-4 flex justify-end">
				<button
					disabled
					onClick={handleProceed}
					className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed"
				>
					Proceed
				</button>
			</div>
		</div>
	);
};
