<script context="module" lang="ts">
	import {
		KQL_CheckoutBillingAddressUpdate,
		KQL_CheckoutEmailUpdate,
		KQL_CheckoutShippingAddressUpdate,
		KQL_RemoveProductFromCheckout
	} from '$lib/graphql/_kitql/graphqlStores';
	import { getCheckoutToken, cartLength, cart, checkout } from '../../../../store/stores';
	import { getState } from '$lib/saleorClient';
	import { CountryCode } from '$lib/graphql/_kitql/graphqlTypes';

	// @ts-ignore
	export const load = async ({ params, url }) => {
		let userState = getState();
		const locale = params.locale;
		url.searchParams.get('token');

		return {
			props: {
				locale,
				userState
			}
		};
	};
</script>

<script lang="ts">
	export let userState: any;
	export let locale: any;

	//button loading
	let loading = false;

	let isAddressSame = false;

	let email: string;

	//@ts-ignore
	email = (userState?.authenticated) ? userState?.user?.email : $checkout.email ? $checkout.email : '';

	let errorMessage_e: string = '';
	let messageIndication_e: boolean;

	// @ts-ignore
	let billAdd = $checkout.billingAddress;
	// @ts-ignore
	let shippAdd = $checkout.shippingAddress;

	//billing
	let firstname: string = billAdd ? billAdd?.firstName : '';
	let lastname: string = billAdd ? billAdd?.lastName : '';
	let company: string = billAdd ? billAdd?.companyName : '';
	let phone: string = billAdd ? billAdd?.phone : '';
	let streetAddress: string = billAdd ? billAdd?.streetAddress1 : '';
	let city: string = billAdd ? billAdd?.city : '';
	let postalcode: string = billAdd ? billAdd?.postalCode : '';
	let state: string = billAdd ? billAdd?.countryArea : '';
	let country: any = billAdd ? billAdd?.country : '';

	let errorMessage_b: string = '';
	let messageIndication_b: boolean;

	//shipping
	let firstname_s: string = shippAdd ? shippAdd?.firstName : '';
	let lastname_s: string = shippAdd ? shippAdd?.lastName : '';
	let company_s: string = shippAdd ? shippAdd?.companyName : '';
	let phone_s: string = shippAdd ? shippAdd?.phone : '';
	let streetAddress_s: string = shippAdd ? shippAdd?.streetAddress1 : '';
	let city_s: string = shippAdd ? shippAdd?.city : '';
	let postalcode_s: string = shippAdd ? shippAdd?.postalCode : '';
	let state_s: string = shippAdd ? shippAdd?.countryArea : '';
	let country_s: any = shippAdd ? shippAdd?.country : '';

	let errorMessage_s: string = '';
	let messageIndication_s: boolean;

	const updateBillingAddress = async () => {
		loading = true;
		if (
			firstname !== '' &&
			lastname !== '' &&
			phone !== '' &&
			streetAddress !== '' &&
			city !== '' &&
			postalcode !== '' &&
			state !== '' &&
			country !== ''
		) {
			const result = await KQL_CheckoutBillingAddressUpdate.mutate({
				variables: {
					token: $getCheckoutToken,
					firstname: firstname,
					lastname: lastname,
					company: company,
					phone: phone,
					streetAddress: streetAddress,
					city: city,
					postalcode: postalcode,
					state: state,
					country: country,
					locale: locale
				}
			});
			const emailAdd = await KQL_CheckoutEmailUpdate.mutate({
				variables: {
					token: $getCheckoutToken,
					email: email,
					locale: locale
				}
			});
			if (result.data?.checkoutBillingAddressUpdate?.errors.length) {
				messageIndication_b = false;
				result.data?.checkoutBillingAddressUpdate?.errors.forEach((e) => {
					if (e.field === 'firstName') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'lastName') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'companyName') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'phone') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'streetAddress1') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'city') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'postalCode') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'countryArea') {
						errorMessage_b = e.field + ': ' + e.message;
					} else if (e.field === 'country') {
						errorMessage_b = e.field + ': ' + e.message;
					} else {
						errorMessage_b = `Unknown error: ${e.message}`;
					}
				});
			} else if (emailAdd.data?.checkoutEmailUpdate?.errors.length) {
				messageIndication_e = false;
				emailAdd.data?.checkoutEmailUpdate?.errors.forEach((e) => {
					if (e.field === 'email') {
						errorMessage_e = e.field + ': ' + e.message;
					} else {
						errorMessage_e = `Unknown error: ${e.message}`;
					}
				});
			} else {
				errorMessage_b = 'Address Saved Successfully';
				messageIndication_b = true;

				//@ts-ignore
				$checkout = $KQL_CheckoutEmailUpdate.data?.checkoutEmailUpdate?.checkout;
				//@ts-ignore
				$checkout = $KQL_CheckoutBillingAddressUpdate.data?.checkoutBillingAddressUpdate?.checkout;
			}
		} else {
			errorMessage_b = 'Fields* are required';
			messageIndication_b = false;
		}
		setTimeout(() => (loading = false), 1000);
	};

	const updateShippingAddress = async () => {
		loading = true;
		if (
			firstname_s !== '' &&
			lastname_s !== '' &&
			phone_s !== '' &&
			streetAddress_s !== '' &&
			city_s !== '' &&
			postalcode_s !== '' &&
			state_s !== '' &&
			country_s !== ''
		) {
			const result = await KQL_CheckoutShippingAddressUpdate.mutate({
				variables: {
					token: $getCheckoutToken,
					firstname: firstname_s,
					lastname: lastname_s,
					company: company_s,
					phone: phone_s,
					streetAddress: streetAddress_s,
					city: city_s,
					postalcode: postalcode_s,
					state: state_s,
					country: country_s,
					locale: locale
				}
			});
			if (result.data?.checkoutShippingAddressUpdate?.errors.length) {
				messageIndication_s = false;
				result.data?.checkoutShippingAddressUpdate?.errors.forEach((e) => {
					if (e.field === 'firstName') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'lastName') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'companyName') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'phone') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'streetAddress1') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'city') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'postalCode') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'countryArea') {
						errorMessage_s = e.field + ':' + e.message;
					} else if (e.field === 'country') {
						errorMessage_s = e.field + ':' + e.message;
					} else {
						errorMessage_s = `Unknown error: ${e.message}`;
					}
				});
			} else {
				errorMessage_s = 'Address Saved Successfully';
				messageIndication_s = true;

				//@ts-ignore
				$checkout = $KQL_CheckoutShippingAddressUpdate.data?.checkoutShippingAddressUpdate?.checkout;
			}
		} else {
			errorMessage_s = 'Fields* are required';
			messageIndication_s = false;
		}
		setTimeout(() => (loading = false), 1000);
	};

	const toggleAddressSame = async () => {
		isAddressSame = !isAddressSame;

		if (isAddressSame) {
			if (
				firstname !== '' &&
				lastname !== '' &&
				phone !== '' &&
				streetAddress !== '' &&
				city !== '' &&
				postalcode !== '' &&
				state !== '' &&
				country !== ''
			) {
				await KQL_CheckoutShippingAddressUpdate.mutate({
					variables: {
						token: $getCheckoutToken,
						firstname: firstname,
						lastname: lastname,
						company: company,
						phone: phone,
						streetAddress: streetAddress,
						city: city,
						postalcode: postalcode,
						state: state,
						country: country,
						locale: locale
					}
				});
				errorMessage_s = 'Address Saved Successfully';
				messageIndication_s = true;

				//@ts-ignore
				$checkout = $KQL_CheckoutShippingAddressUpdate.data?.checkoutShippingAddressUpdate?.checkout;
			} else {
				errorMessage_s = 'Fields* are required';
				messageIndication_s = false;
			}
		}
	};

	//let voucherCode: any = '';

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
	<title>Checkout Address - Saleor SvelteKit Storefront</title>
</svelte:head>

<main
	class="min-h-screen w-screen max-w-7xl md:px-8 md:mx-auto overflow-hidden flex md:flex-row flex-col justify-between"
>
	<div class="md:w-2/3 w-full">
		<section class="flex flex-auto flex-col overflow-y-auto px-4 space-y-4 pb-4">
			<div>
				<div class="mt-2 mb-4 flex justify-between">
					<h2 class="text-black font-poppins text-lg font-medium">Contact Details</h2>
					{#if userState?.authenticated}
						<p class="mr-5 font-poppins text-md text-black font-medium">Account Checkout</p>
					{:else}
						<p class="mr-5 font-poppins text-md text-black font-medium">Guest Checkout</p>
					{/if}
				</div>

				<form class="px-4">
					<div class="grid grid-cols-12 gap-4 w-full">
						<div class="col-span-full">
							<!--<label for="email" class="block text-md mb-2 font-poppins">Email Address*</label>-->

							<input
								disabled={userState?.authenticated ? true : false}
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm {userState?.authenticated
									? 'input-disabled'
									: ''}"
								type="email"
								placeholder="Email Address*"
								bind:value={email}
							/>
						</div>
						<div class="col-span-full flex justify-end items-end space-x-6">
							{#if errorMessage_e}
								<p
									class="text-sm font-poppins {messageIndication_e
										? 'text-green-500'
										: 'text-red-500'} pb-5"
								>
									{errorMessage_e}
								</p>
							{/if}
						</div>
					</div>
				</form>
			</div>
			<div>
				<div class="mt-4 mb-4">
					<h2 class="text-black font-poppins text-lg font-medium">Billing Address</h2>
				</div>

				<form class="px-4" on:submit|preventDefault={updateBillingAddress}>
					<div class="grid grid-cols-12 gap-4 w-full">
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="First Name*"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={firstname}
								/>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="Last Name*"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={lastname}
								/>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="Company"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={company}
								/>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="Phone"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={phone}
								/>
							</div>
						</div>
						<div class="col-span-full">
							<div class="mt-1">
								<textarea
									placeholder="Street Address*"
									rows="3"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={streetAddress}
								/>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="City*"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={city}
								/>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="Postal Code*"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={postalcode}
								/>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<select
									placeholder="Country*"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={country}
								>
									<option value="">Country*</option>

									<option value={CountryCode.Us}>United States of America</option>
								</select>
							</div>
						</div>
						<div class="col-span-full sm:col-span-6">
							<div class="mt-1">
								<input
									type="text"
									placeholder="State*"
									class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
									bind:value={state}
								/>
							</div>
						</div>

						<div class="col-span-full flex justify-end items-end space-x-6">
							{#if errorMessage_b}
								<p
									class="text-sm font-poppins {messageIndication_b
										? 'text-green-500'
										: 'text-red-500'} pb-5"
								>
									{errorMessage_b}
								</p>
							{/if}
							<button
								type="submit"
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
			<div>
				<div class="mt-4 mb-4">
					<h2 class="text-black font-poppins text-lg font-medium">Shipping Address</h2>
				</div>
				<div class="px-4">
					<div class="space-x-2 py-2">
						<div class="inline-flex items-center space-x-3">
							<input
								type="checkbox"
								on:click={toggleAddressSame}
								class="form-switch transition-all duration-150 ease-out rounded-full h-6 w-10 text-[#2b91cc] focus:ring-0"
							/>
							<label for="isAddress" class="text-md font-medium font-poppins">
								Same as Billing Address
							</label>
						</div>
					</div>
					{#if !isAddressSame}
						<form on:submit|preventDefault={updateShippingAddress}>
							<div class="grid grid-cols-12 gap-4 w-full">
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="First Name*"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={firstname_s}
										/>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="Last Name*"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={lastname_s}
										/>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="Company"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={company_s}
										/>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="Phone"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={phone_s}
										/>
									</div>
								</div>
								<div class="col-span-full">
									<div class="mt-1">
										<textarea
											placeholder="Street Address*"
											rows="3"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={streetAddress_s}
										/>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="City*"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={city_s}
										/>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="Postal Code*"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={postalcode_s}
										/>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<select
											placeholder="Country*"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={country_s}
										>
											<option value="">Country*</option>

											<option value={CountryCode.Us}>United States of America</option>
										</select>
									</div>
								</div>
								<div class="col-span-full sm:col-span-6">
									<div class="mt-1">
										<input
											type="text"
											placeholder="State*"
											class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
											bind:value={state_s}
										/>
									</div>
								</div>

								<div class="col-span-full flex justify-end items-end space-x-6">
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
										type="submit"
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
					{/if}
				</div>
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
				class="{errorMessage_b === 'Address Saved Successfully' &&
				errorMessage_s === 'Address Saved Successfully'
					? ''
					: 'btn-disabled bg-gray-400 cursor-not-allowed'} btn w-full bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] font-poppins border-0 rounded-none py-2 px-8 mt-4 flex items-center justify-center text-white shadow-sm focus:outline-none focus:ring-0"
				href={`/default-channel/EN_US/checkout/shipping?token=${$getCheckoutToken}`}
			>
				Continue to Shipping
			</a>
		</div>
	</div>
</main>
