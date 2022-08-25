<script context="module" lang="ts">
	import {
		KQL_CheckoutShippingMethodUpdate,
		KQL_RemoveProductFromCheckout
	} from '$lib/graphql/_kitql/graphqlStores';
	import { getCheckoutToken, cartLength, cart, checkout } from '../../../../store/stores';

	// @ts-ignore
	export const load = async ({ params, url }) => {
		const locale = params.locale;
		url.searchParams.get('token');

		return {
			props: {
				locale
			}
		};
	};
</script>

<script lang="ts">
	export let locale: any;

	// button loading
	let loading = false;

	let selectedShippingMethod: any;

	let errorMessage_s: string = '';
	let messageIndication_s: boolean;

	const updateShipping = async () => {
		loading = true;
		if (selectedShippingMethod !== null) {
			const result = await KQL_CheckoutShippingMethodUpdate.mutate({
				variables: {
					token: $getCheckoutToken,
					shippingMethodId: selectedShippingMethod.id,
					locale: locale
				}
			});
			errorMessage_s = 'Shipping Method Saved';
			messageIndication_s = true;
			
		} else {
			errorMessage_s = 'Please select shipping method';
			messageIndication_s = false;
		}
		setTimeout(() => (loading = false), 1000);

		//@ts-ignore
		$cart = $KQL_CheckoutShippingMethodUpdate.data?.checkoutShippingMethodUpdate?.checkout?.lines;
		//@ts-ignore
		$cartLength = $KQL_CheckoutShippingMethodUpdate.data?.checkoutShippingMethodUpdate?.checkout?.lines.length;
		//@ts-ignore
		$checkout = $KQL_CheckoutShippingMethodUpdate.data?.checkoutShippingMethodUpdate?.checkout;
	};

	const removeFromCart = async (id: any) => {
		await KQL_RemoveProductFromCheckout.mutate({
			variables: {
				checkoutToken: $getCheckoutToken,
				lineId: id,
				locale: locale
			}
		});

		//@ts-ignore
		$cart = $KQL_RemoveProductFromCheckout.data?.checkoutLineDelete?.checkout?.lines;
		//@ts-ignore
		$cartLength = $KQL_RemoveProductFromCheckout.data?.checkoutLineDelete?.checkout?.lines.length;
		//@ts-ignore
		$checkout = $KQL_RemoveProductFromCheckout.data?.checkoutLineDelete?.checkout;
	};

</script>

<svelte:head>
	<title>Checkout Shipping - Saleor SvelteKit Storefront</title>
</svelte:head>

<main
	class="min-h-screen w-screen max-w-7xl md:px-8 md:mx-auto overflow-hidden flex md:flex-row flex-col justify-between"
>
	<div class="md:w-2/3 w-full">
		<section class="flex flex-auto flex-col overflow-y-auto px-4 space-y-4 pb-4">
			<div>
				<div class="mt-2 mb-4">
					<h2 class="text-black font-poppins text-lg font-medium">Shipping Method</h2>
				</div>
				<form class="px-4 pt-4">
					<div class="grid grid-cols-12 gap-4 w-full">
						<div class="col-span-full space-y-4">
							{#each $checkout?.availableShippingMethods || [] as method}
								<div class="grow w-full space-y-1">
									<div class="p-4 rounded-none flex items-center justify-between space-x-1">
										<label class="flex items-center">
											<input
												type="radio"
												value={method}
												bind:group={selectedShippingMethod}
												class="border border-gray-200 h-5 w-5 text-[#2b91cc] focus:ring-0 cursor-pointer"
											/>
											<span class="ml-4 text-md text-black font-poppins cursor-pointer"
												>{method?.name} (+${method?.price?.amount})</span
											>
										</label>
										<div class="flex-none">
											<span class="mr-4 text-md text-black font-poppins cursor-pointer"
												>${method?.price?.amount}</span
											>
										</div>
									</div>
								</div>
							{/each}
						</div>
						<div class="col-span-full flex justify-end items-end space-x-6 pt-4">
							{#if errorMessage_s}
								<p
									class="text-sm font-poppins {messageIndication_s
										? 'text-green-500'
										: 'text-red-500'} pb-5"
								>
									{errorMessage_s}
								</p>
							{/if}

							<button
								on:click={updateShipping}
								type="button"
								class="btn mt-4 mb-3 w-24 min-h-[2.2rem] h-[2.4rem] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm"
							>
								{#if loading}
									<i class="fa regular fa-circle-notch fa-spin" />
								{:else}
									Save
								{/if}
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	</div>
	<div class="md:w-1/3 w-full">
		<section class="max-w-md w-full flex flex-col ">
			<div class="bg-white rounded-none border-0 shadow-sm p-8">
				<h1 class="text-lg font-poppins font-semibold text-black pb-4 uppercase">Order Summary</h1>

				<ul class="divide-y divide-gray-200 pt-4 pb-8">
					{#each $cart || [] as item}
						<li class="flex justify-between items-center py-2">
							<div class="flex items-center space-x-2">
								<img
									alt=""
									class="inline-block w-16 h-16 rounded-none border bg-gray-200"
									src={item?.variant?.product?.thumbnail?.url}
								/>
								<div>
									<p class="font-medium font-poppins text-sm text-black truncate">
										{item?.variant?.product?.name}
									</p>
									<p class="font-medium font-poppins text-sm text-[#2b91cc]">
										{item?.variant?.name}
									</p>
									<button
										on:click={() => removeFromCart(item.id)}
										type="button"
										class="btn btn-sm btn-ghost px-0 py-0 hover:bg-transparent ml-4 text-sm font-medium text-black sm:ml-0"
									>
										<i class="fa-regular fa-trash-can fa-lg" />
									</button>
								</div>
							</div>
							<div class="inline-flex space-x-2 font-semibold">
								<p class="font-medium font-poppins text-sm text-black truncate">
									{item?.quantity} X ${item?.variant?.pricing?.price?.gross?.amount}
								</p>
							</div>
						</li>
					{/each}
				</ul>
				

				<div class="flow-root">
					<dl class="text-sm">
						<div class="py-2 flex items-center justify-between font-medium">
							<dt class="text-black font-poppins">Subtotal</dt>
							<dd class="text-black font-poppins">${$checkout.subtotalPrice?.net?.amount}</dd>
						</div>
						<div
							class="py-2 flex items-center justify-between border-t border-gray-300 font-medium"
						>
							<dt class="text-black font-poppins">Shipping</dt>
							<dd class="text-black font-poppins">${$checkout.shippingPrice?.gross?.amount}</dd>
						</div>
						<div class="py-2 flex items-center justify-between font-medium">
							<dt class="text-black font-poppins">Tax</dt>
							<dd class="text-black font-poppins">${$checkout.subtotalPrice?.tax?.amount}</dd>
						</div>
						<div
							class="pt-4 flex items-center justify-between border-t border-gray-300 font-medium"
						>
							<dt class="text-lg text-black font-poppins">Total</dt>
							<dd class="text-lg text-black font-poppins">
								${$checkout.totalPrice?.gross?.amount}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>
		<div class="mt-6">
			<a
				class="{errorMessage_s === 'Shipping Method Saved'
					? ''
					: 'btn-disabled bg-gray-400 cursor-not-allowed'} btn w-full bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] font-poppins border-0 rounded-none py-2 px-8 mt-4 flex items-center justify-center text-white shadow-sm focus:outline-none focus:ring-0"
				href={`/default-channel/EN_US/checkout/payment?token=${$getCheckoutToken}`}
				>Continue to Review & Payment</a
			>
		</div>
	</div>
</main>
