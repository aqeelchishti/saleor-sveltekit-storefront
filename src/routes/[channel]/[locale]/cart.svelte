<script context="module" lang="ts">
	import {
		KQL_CheckoutLineUpdate,
		KQL_RemoveProductFromCheckout
	} from '$lib/graphql/_kitql/graphqlStores';
	import { getCheckoutToken, cartLength, cart, checkout } from '../../../store/stores';
	import { getState } from '$lib/saleorClient';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	// @ts-ignore
	export const load = async ({ params }) => {
		let userState = getState();
		const locale = params.locale;
		
		if (browser) {
			if (!cart && !getCheckoutToken) {
				await goto('/default-channel/EN_US/cart');
			}
		}
		
		return {
			props: {
				locale,
				userState
			}
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	export let locale: any;
	export let userState: any;

	onMount(async () => {
		if (!$cart && !$getCheckoutToken) {
			await goto('/default-channel/EN_US/cart');
		}
	});

	//button loading
	let loadingv = false;

	let voucherCode: any = '';
	let errorMessage_v: string = '';
	let messageIndication_v: boolean;

	const removeFromCart = async (id: any) => {
		await KQL_RemoveProductFromCheckout.mutate({
			variables: {
				checkoutToken: $getCheckoutToken,
				lineId: id,
				locale: locale
			}
		});

		// @ts-ignore
		$cart = $KQL_RemoveProductFromCheckout.data?.checkoutLineDelete?.checkout?.lines;
		// @ts-ignore
		$cartLength = $KQL_RemoveProductFromCheckout.data?.checkoutLineDelete?.checkout?.lines.length;
		// @ts-ignore
		$checkout = $KQL_RemoveProductFromCheckout.data?.checkoutLineDelete?.checkout;
	};

	const updateCart = async (quanT: any, varId: any) => {
		await KQL_CheckoutLineUpdate.mutate({
			variables: {
				token: $getCheckoutToken,
				pQuantity: quanT,
				variantId: varId,
				locale: locale
			}
		});

		// @ts-ignore
		$cart = $KQL_CheckoutLineUpdate.data?.checkoutLinesUpdate?.checkout?.lines;
		// @ts-ignore
		$cartLength = $KQL_CheckoutLineUpdate.data?.checkoutLinesUpdate?.checkout?.lines.length;
		// @ts-ignore
		$checkout = $KQL_CheckoutLineUpdate.data?.checkoutLinesUpdate?.checkout;
	};

</script>

<svelte:head>
	<title>Cart - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px] pb-20">
	<header class="mb-4 mt-4">
		<nav class="max-w-7xl mx-auto px-8 mt-2">
			<ol class="flex items-center">
				<li>
					<a href="/default-channel/EN_US/" class="font-poppins text-md">Home</a>
				</li>
				<li class="flex items-center px-1 sm:px-2 opacity-25">
					<i class="fa-regular fa-angle-right fa-md px-1" />
				</li>
				<li class="font-poppins text-md">Cart</li>
			</ol>
		</nav>
		<div class="max-w-7xl mx-auto px-8">
			<div class="container mx-auto h-20 flex items-center">
				<div class="sm:ml-10 text-gray-50 text-center sm:text-left">
					<h1 class="text-2xl font-semibold text-black mb-2 font-poppins">Cart Details</h1>
				</div>
			</div>
		</div>
	</header>
	<main>
		{#if ($getCheckoutToken && $cart)}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-8">
			<section class="col-span-2">
				<ul class="divide-y divide-gray-200">
					{#each $cart || [] as item}
						<li class="flex py-2">
							<div class="flex-shrink-0 bg-white w-28 h-28 object-center object-cover relative">
								<span
									class="border-0 shadow-sm"
									style="box-sizing: border-box; display: block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: absolute; inset: 0px;"
								>
									<img
										alt=""
										
										src={item?.variant?.product?.thumbnail?.url}
										style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
									/>
								</span>
							</div>
							<div class="ml-6 flex-1 flex flex-col justify-center">
								<div>
									<div class="flex justify-between">
										<div class="pr-6">
											<h3 class="text-lg font-semibold font-poppins">
												<a
													href="/default-channel/EN_US/product/{item?.variant?.product?.slug}?vid="
													class="font-medium text-black">{item?.variant?.product?.name}</a
												>
											</h3>
											<h4 class="font-regular">
												<p class="text-[#2b91cc] font-poppins text-md">{item?.variant?.name}</p>
												<p class="text-black  font-poppins text-sm">
													${item?.variant?.pricing?.price?.gross?.amount}
												</p>
											</h4>
											<button
												on:click={() => removeFromCart(item.id)}
												type="button"
												class="btn btn-ghost px-0 py-0 hover:bg-transparent ml-4 text-sm font-medium text-black sm:ml-0 min-h-[2.2rem] h-[2.4rem]"
											>
												<i class="fa-regular fa-trash-can fa-xl" />
											</button>
										</div>
										<div class="flex justify-items-end space-x-1">
											<input
												type="number"
												class="h-8 w-16 pt-3 disabled:text-black block border-0 text-black font-poppins rounded-none shadow-sm sm:text-sm focus:ring-0"
												min="1"
												max="20"
												bind:value={item.quantity}
												on:change={() => updateCart(item.quantity, item.variant?.id)}
											/>

											<p class="text-lg pt-[6px] text-black font-poppins text-center pl-4">
												${item?.totalPrice.gross?.amount}
											</p>
										</div>
									</div>
								</div>
							</div>
						</li>
					
					{/each}
				</ul>
			</section>
			
			<div>
				
				<section>
					<div class="bg-white rounded-none border-0 shadow-sm p-8">

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
									<dd class="text-black font-poppins">
										${$checkout.shippingPrice?.gross?.amount}
									</dd>
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
					<!--{#if userState?.authenticated}-->
					<a
						class="btn w-full bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] font-poppins border-0 rounded-none py-2 px-8 flex items-center justify-center text-white shadow-sm focus:outline-none focus:ring-0"
						href={userState?.authenticated
							? `/default-channel/EN_US/checkout/address?token=${$getCheckoutToken}`
							: `/default-channel/EN_US/guest-or-account/login?token=${$getCheckoutToken}`}
					>
						Proceed to Checkout
					</a>
					
				</div>

			</div>
				
		</div>
		{:else}
			<div class="text-center py-32">
				Empty!<br />
				<i class="fa-regular fa-crate-empty fa-4x" />
			</div>
		{/if}
	</main>
</div>
