<script context="module" lang="ts">
	import {
		KQL_CheckoutPaymentCreate,
		KQL_RemoveProductFromCheckout,
		KQL_CheckoutAddPromoCode,
		KQL_CheckoutComplete
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
	import { loadStripe } from '@stripe/stripe-js';
	import { goto } from '$app/navigation';

	export let locale: any;

	let loading = false;

	let selectedPaymentMethod: any;

	let errorMessage_p: string;
	let messageIndication_p: boolean;

	let stripe: any = null;
	let cardElement: any = null;

	let payload: any;

	//button loading
	let loadingv = false;

	let voucherCode: any = '';
	let errorMessage_v: string = '';
	let messageIndication_v: boolean;

	const loadStripeElements = async () => {
		stripe = await loadStripe(selectedPaymentMethod.config[0].value);
		let elements = stripe.elements();
		let style = {
			base: {
				color: '#32325d',
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a'
			}
		};
		cardElement = elements.create('card', { style: style });
		cardElement.mount('#card-id');
	};

	const placeOrder = async () => {
		loading = true;
		if (selectedPaymentMethod !== null) {
			if (selectedPaymentMethod.id === 'saleor.payments.stripe') {
				payload = await stripe.createPaymentMethod({
					type: 'card',
					card: cardElement,
					billing_details: {
						address: {
							//@ts-ignore
							city: $checkout.billingAddress?.city,
							//@ts-ignore
							country: $checkout.billingAddress?.country.code,
							//@ts-ignore
							line1: $checkout.billingAddress?.streetAddress1,
							//@ts-ignore
							postal_code: $checkout.billingAddress?.postalCode,
							//@ts-ignore
							state: $checkout.billingAddress?.countryArea
						},
						//@ts-ignore
						email: $checkout.email,
						//@ts-ignore
						name: `${$checkout.billingAddress?.firstName} ${$checkout.billingAddress?.lastName}`,
						//@ts-ignore
						phone: $checkout.billingAddress?.phone
					}
				});
				if (payload.error) {
					errorMessage_p = payload.error;
					messageIndication_p = false;
				} else {
					const result = await KQL_CheckoutPaymentCreate.mutate({
						variables: {
							checkoutToken: $getCheckoutToken,
							paymentInput: {
								gateway: selectedPaymentMethod.id,
								token: payload.paymentMethod.id,
								//@ts-ignore
								amount: $checkout.totalPrice?.gross?.amount
							},
							locale: locale
						}
					});
					if (result.data?.checkoutPaymentCreate?.errors.length) {
						messageIndication_p = false;
						result.data?.checkoutPaymentCreate?.errors.forEach((e) => {
							errorMessage_p = e.field + ':' + e.message;
						});
					} else {
						const res2 = await KQL_CheckoutComplete.mutate({
							variables: {
								checkoutToken: $getCheckoutToken
							}
						});
						if (res2.data?.checkoutComplete?.errors.length) {
							messageIndication_p = false;
							res2.data?.checkoutComplete?.errors.forEach((e) => {
								errorMessage_p = e.field + ':' + e.message;
							});
						} else {
							let order = res2.data?.checkoutComplete?.order;

							// Additional payment action is needed (ex. 3D Secure)
							if (res2.data?.checkoutComplete?.confirmationNeeded) {
								// Parse data for the Stripe
								const confirmationData = JSON.parse(
									res2.data?.checkoutComplete?.confirmationData || ''
								);

								// Execute additional action at Stripe
								const stripeConfirmationResponse = await stripe.confirmCardPayment(
									confirmationData.client_secret,
									{
										payment_method: payload.paymentMethod.id
									}
								);
								if (stripeConfirmationResponse.error) {
									messageIndication_p = false;
									errorMessage_p = stripeConfirmationResponse.error;
								} else {
									const res3 = await KQL_CheckoutComplete.mutate({
										variables: {
											checkoutToken: $getCheckoutToken
										}
									});
									if (res3.data?.checkoutComplete?.errors.length) {
										messageIndication_p = false;
										res3.data?.checkoutComplete?.errors.forEach((e) => {
											errorMessage_p = e.field + ':' + e.message;
										});
									} else {
										if (res3.data?.checkoutComplete?.order) {
											errorMessage_p = 'Payment completed and order placed';
											messageIndication_p = true;
											order = res3.data?.checkoutComplete?.order;

											$getCheckoutToken = "";
											localStorage.setItem("getCheckoutToken", "");
											$cartLength = 0;
											$cart = [];
											$checkout = {};

											await goto(`/default-channel/EN_US/order/${order.token}`);
										}
										console.log(order);
									}
								}
							}
						}
					}
				}
			}
		} else {
			errorMessage_p = 'Please select payment method';
			messageIndication_p = false;
		}
		setTimeout(() => (loading = false), 2000);
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

	const addVoucher = async () => {
		loadingv = true;
		if (voucherCode !== '') {
			const result = await KQL_CheckoutAddPromoCode.mutate({
				variables: {
					token: $getCheckoutToken,
					promoCode: voucherCode,
					locale: locale
				}
			});
			
			if (result.data?.checkoutAddPromoCode?.errors.length) {
					messageIndication_v = false;
					result.data?.checkoutAddPromoCode?.errors.forEach((e) => {
						if (e.field === 'voucherCode') {
							errorMessage_v = e.field + ': ' + e.message;
						} else {
							errorMessage_v = `Unknown error: ${e.message}`;
						}
					});
			}
			else {
					errorMessage_v = 'Voucher Applied';
					messageIndication_v = true;

					// @ts-ignore
				$checkout = $KQL_CheckoutAddPromoCode.data?.checkoutAddPromoCode?.checkout;
			}
		}
		else {
			errorMessage_v = 'Please Enter Voucher Code';
			messageIndication_v = false;
		}
		setTimeout(() => (loadingv = false), 600);
	};

</script>

<svelte:head>
	<title>Checkout Payment - Saleor SvelteKit Storefront</title>
</svelte:head>

<main
	class="min-h-screen w-screen max-w-7xl md:px-8 md:mx-auto overflow-hidden flex md:flex-row flex-col justify-between"
>
	<div class="md:w-2/3 w-full">
		<section class="flex flex-auto flex-col overflow-y-auto px-4 space-y-4 pb-4">
			<div>
				<div class="pb-2">
					<h2 class="text-black font-poppins text-xl font-medium">Review Order</h2>
				</div>
				<div class="px-4 pt-2">
					<div class="grid grid-cols-12 gap-4 w-full">
						<div class="col-span-full space-y-2">
							<div class="p-6 bg-white rounded-none shadow-sm items-center">
								<div class="mb-6 text-black font-poppins">
									<h4 class="text-md font-medium mb-4 underline">Billing Address</h4>
									<p class="text-sm font-normal mb-3">
										<span class="tracking-wide font-medium"
											>{$checkout.billingAddress?.firstName}
											{$checkout.billingAddress?.lastName}</span
										><br />
										<span class="tracking-wide"
											>{$checkout.billingAddress?.streetAddress1}, {$checkout.billingAddress?.city}, {$checkout
												.billingAddress?.postalCode}, {$checkout.billingAddress?.countryArea}</span
										><br />
										<span class="tracking-wide">{$checkout.billingAddress?.country.country}</span
										><br />
										<span class="tracking-wide"
											><span class="underline">Email</span>: {$checkout.email}</span
										><br />
										<span class="tracking-wide"
											><span class="underline">Phone</span>: {$checkout.billingAddress?.phone}</span
										><br />
									</p>
								</div>
								<div class="mb-6 text-black font-poppins">
									<h4 class="text-md font-medium mb-3 underline">Shipping Address</h4>
									<p class="text-sm font-normal mb-3">
										<span class="tracking-wide font-medium"
											>{$checkout.shippingAddress?.firstName}
											{$checkout.shippingAddress?.lastName}</span
										><br />
										<span class="tracking-wide"
											>{$checkout.shippingAddress?.streetAddress1}, {$checkout.shippingAddress
												?.city}, {$checkout.shippingAddress?.postalCode}, {$checkout.shippingAddress
												?.countryArea}</span
										><br />
										<span class="tracking-wide">{$checkout.shippingAddress?.country.country}</span
										><br />
										<span class="tracking-wide"
											><span class="underline">Email</span>: {$checkout.email}</span
										><br />
										<span class="tracking-wide"
											><span class="underline">Phone</span>: {$checkout.shippingAddress
												?.phone}</span
										><br />
									</p>
								</div>
								<div class="mb-6 text-black font-poppins">
									<h4 class="text-md font-medium mb-3 underline">Shipping Method</h4>
									<p class="text-sm font-normal mb-3">
										<span class="tracking-wide font-medium">{$checkout.shippingMethod?.name}</span
										><br />
										<span class="tracking-wide">+${$checkout.shippingMethod?.price?.amount}</span
										><br />
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="pt-12 pb-2">
					<h2 class="text-black font-poppins text-xl font-medium">Payment</h2>
				</div>
				<form class="px-4 pt-1">
					<div class="grid grid-cols-12 gap-4 w-full">
						<div class="col-span-full space-y-2">
							{#each $checkout?.availablePaymentGateways || [] as method}
								{#if method?.id === 'saleor.payments.stripe'}
									<div class="p-4 rounded-none flex items-center justify-between space-x-1">
										<label class="flex items-center">
											<input
												type="radio"
												value={method}
												bind:group={selectedPaymentMethod}
												on:change={loadStripeElements}
												class="border border-gray-200 h-5 w-5 text-[#2b91cc] focus:ring-0 cursor-pointer"
											/>
											<span class="ml-4 text-lg text-black font-medium font-poppins cursor-pointer"
												>{method?.name}</span
											>
										</label>
									</div>
									{#if selectedPaymentMethod === method}
										<div class="px-4">
											<div class="margin-card font-poppins">
												<div id="card-id" />
											</div>
											<br />

											<div class="col-span-full flex justify-end items-end space-x-6">
												{#if errorMessage_p}
													<p
														class="text-sm font-poppins {messageIndication_p
															? 'text-green-500'
															: 'text-red-500'} pb-5"
													>
														{errorMessage_p}
													</p>
												{/if}
											</div>
										</div>
									{/if}
								{/if}
							{/each}
						</div>
					</div>
					<button
						on:click={placeOrder}
						type="button"
						class="{selectedPaymentMethod ? 'bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc]' : 'btn-disabled bg-gray-400 cursor-not-allowed'} btn w-full bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] font-poppins border-0 rounded-none py-2 px-8 mt-4 flex items-center justify-center text-white shadow-sm focus:outline-none focus:ring-0"
					>
						{#if loading}
							<i class="fa regular fa-circle-notch fa-spin" />
						{:else}
							Place Order
						{/if}
					</button>
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

				<form class="pb-4">
					<label for="discount-code" class="block text-sm font-medium font-poppins text-black"
						>Discount code</label
					>
					<div class="flex space-x-2 mt-1">
						<input
							bind:value={voucherCode}
							type="text"
							class="block input-sm w-full border-gray-300 rounded-none font-poppins focus:ring-[#2b91cc] focus-outline-none focus:ring-1 border-1 shadow-sm sm:text-sm"
						/>
						{#if errorMessage_v}
							<p
								class="text-sm font-poppins {messageIndication_v
									? 'text-green-500'
									: 'text-red-500'} pb-5"
							>
								{errorMessage_v}
							</p>
						{/if}
						<button
							on:click|preventDefault={addVoucher}
							class="btn btn-sm border-0 text-sm font-semibold capitalize font-poppins text-white rounded-none px-4 py-0 leading-[0.5rem] bg-[#2b91cc] {voucherCode
								? 'bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc]'
								: 'btn-disabled bg-gray-400 cursor-not-allowed'}">
								{#if loadingv}
									<i class="fa regular fa-circle-notch fa-spin" />
								{:else}
									Activate
								{/if}
							</button
						>
					</div>
				</form>

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
	</div>
</main>
