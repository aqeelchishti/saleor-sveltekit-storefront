<script context="module" lang="ts">
	import {
		KQL_ProductBySlug,
		KQL_CheckoutAddProductLine,
		KQL_CreateCheckout,
		KQL_CheckoutByToken
	} from '$lib/graphql/_kitql/graphqlStores';
	import { getState } from '$lib/saleorClient';
	import { get } from 'svelte/store';
	import { getCheckoutToken, cartLength, cart, checkout } from '../../../../store/stores';

	// @ts-ignore
	export const load = async ({ fetch, params, url }) => {
		let userState = getState();

		const channel = params.channel;
		const locale = params.locale;
		const slug = params.slug;
		const selectedVariantId = url.searchParams.get('vid');

		const selectedVariant =
			get(KQL_ProductBySlug).data?.product?.variants?.find((v) => v?.id === selectedVariantId) ||
			'';

		//get product detail
		await KQL_ProductBySlug.queryLoad({
			fetch,
			variables: {
				channel: channel,
				locale: locale,
				slug: slug
			},
			settings: { policy: (selectedVariant ? 'cache-first' : 'network-only') }
		});

		let setToken: any;
		getCheckoutToken.subscribe((val) => (setToken = val));

		await KQL_CheckoutByToken.queryLoad({
			fetch,
			variables: {
				checkoutToken: setToken,
				locale: locale
			}
		});

		return {
			props: {
				selectedVariantId,
				selectedVariant,
				channel,
				locale,
				userState
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	export let selectedVariantId: string;
	export let selectedVariant: any;
	export let channel: any;
	export let locale: any;
	export let userState: any;

	let product = $KQL_ProductBySlug.data?.product;
	let descrip = JSON.parse(product?.description);

	//button loading
	let loading = false;

	// select varient
	let chooseValue = 'Choose Varient';
	let prodQuantity: number = 1;

	const selectVarient = async () => {
		if (selectedVariantId !== '' || undefined) {
			await goto(`/default-channel/EN_US/product/${product?.slug}?vid=${selectedVariantId}`, {
				keepfocus: true
			});
		} else if (chooseValue === 'Choose Varient' && selectedVariantId === '') {
			await goto(`/default-channel/EN_US/product/${product?.slug}?vid=`, {
				keepfocus: true
			});
		}
	};

	const addToCart = async () => {
		loading = true;
		let checkOut: any;
		if (!$getCheckoutToken) {
			if (!userState?.authenticated) {
				checkOut = await KQL_CreateCheckout.mutate({
					variables: {
						channel: channel,
						email: '',
						lines: []
					}
				});
			} else {
				checkOut = await KQL_CreateCheckout.mutate({
					variables: {
						channel: channel,
						email: userState?.user?.email,
						lines: []
					}
				});
			}

			$getCheckoutToken = checkOut?.data?.checkoutCreate?.checkout?.token;

			await KQL_CheckoutAddProductLine.mutate({
				variables: {
					checkoutToken: $getCheckoutToken,
					variantId: selectedVariantId,
					productQuantity: prodQuantity,
					locale: locale
				}
			});
		} else {
			await KQL_CheckoutAddProductLine.mutate({
				variables: {
					checkoutToken: $getCheckoutToken,
					variantId: selectedVariantId,
					productQuantity: prodQuantity,
					locale: locale
				}
			});
		}
		setTimeout(() => (loading = false), 1000);
		

		// @ts-ignore
		$cart = $KQL_CheckoutAddProductLine.data?.checkoutLinesAdd?.checkout?.lines;
		// @ts-ignore
		$cartLength = $KQL_CheckoutAddProductLine.data?.checkoutLinesAdd?.checkout?.lines.length;
		// @ts-ignore
		$checkout = $KQL_CheckoutAddProductLine.data?.checkoutLinesAdd?.checkout;

		console.log($cart);
		console.log($cartLength);
		console.log($checkout);
	};
</script>

<svelte:head>
	<title>{$KQL_ProductBySlug?.data?.product?.name || ''} - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px] pb-20">
	{#if $KQL_ProductBySlug.isFetching}
		<i class="absolute fa-regular fa-3x fa-circle-notch fa-spin -top-1 my-[350px] mx-[42.5%]" />
	{:else if $KQL_ProductBySlug.errors}
		{#each $KQL_ProductBySlug.errors as error}
			<p>{error.message}</p>
		{/each}
	{:else}
		<header class="mb-4 mt-4">
			<nav class="max-w-7xl mx-auto px-8 mt-2">
				<ol class="flex items-center">
					<li>
						<a href="/default-channel/EN_US/" class="font-poppins text-md">Home</a>
					</li>
					<li class="flex items-center px-1 sm:px-2 opacity-25">
						<i class="fa-regular fa-angle-right fa-md px-1" />
					</li>
					<li>
						<a href="/default-channel/EN_US/" class="font-poppins text-md">Product</a>
					</li>
					<li class="flex items-center px-1 sm:px-2 opacity-25">
						<i class="fa-regular fa-angle-right fa-md px-1" />
					</li>
					<li class="font-poppins text-md">
						{product?.name}
					</li>
				</ol>
			</nav>
		</header>
		<main
			class="grid grid-cols-1 gap-4 max-h-full overflow-hidden md:overflow-hidden max-w-7xl mx-auto px-8 md:grid-cols-3"
		>
			<div class="col-span-2">
				<div
					class="mt-1 mb-2 ml-8 w-[80%] max-h-screen grid grid-cols-1 md:h-full h-full"
					style="scroll-snap-type: both mandatory;"
				>
					<div class="aspect-w-1 aspect-h-1" style="scroll-snap-align: start;">
						<span class="overflow-auto">
							{#if product?.media}
								{#each product?.media?.slice(0, 1) || [] as image}
									<img alt={image.alt} src={image.url} />
								{/each}
							{:else}
								<h2>No Image</h2>
							{/if}
						</span>
					</div>
				</div>
			</div>
			<div class="space-y-8 mt-10 md:mt-0">
				<div>
					<h1 class="text-2xl font-semibold font-poppins tracking-tight text-gray-800">
						{product?.name}
					</h1>
					{#if selectedVariantId !== '' || undefined}
						<!--{#if selectedVariant?.pricing?.onSale}
							<h2 class="text-lg font-semibold font-poppins tracking-tight text-gray-800">
								<s>${selectedVariant?.pricing?.price?.gross?.amount}</s>  ${selectedVariant?.pricing?.discount?.gross?.amount}
							</h2>
						{:else}-->
							<h2 class="text-lg font-semibold font-poppins tracking-tight text-gray-800">
								${selectedVariant?.pricing?.price?.gross?.amount}
							</h2>
						<!--{/if}-->
					{:else}
						<h2 class="text-lg font-semibold font-poppins tracking-tight text-gray-800">
							${product?.pricing?.priceRange?.start?.gross?.amount}
						</h2>
					{/if}

					<a
						class="text-lg mt-2 font-medium text-[#2b91cc] font-poppins cursor-pointer"
						href={`/default-channel/EN_US/category/${product?.category?.slug}`}
					>
						{product?.category?.name}
					</a>
				</div>

				<div>
					{#if selectedVariant?.quantityAvailable < 1 && (selectedVariantId !== '' || undefined)}
						<p class="text-red-500 font-poppins text-md mt-2">Out of Stock</p>
					{:else}
						<!---->
					{/if}
				</div>
				
				<select
					bind:value={selectedVariantId}
					on:change={selectVarient}
					class="px-4 w-full border-0 py-2 rounded-none outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
				>
					<option value="">Choose Varient</option>
					{#each product?.variants || [] as variant}
						<option value={variant?.id}>{variant?.name}</option>
					{/each}
				</select>
				<input
					class="px-4 w-full border-0 py-2 rounded-none outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
					type="number"
					bind:value={prodQuantity}
					min="1"
					max="20"
				/>
				<button
					type="button"
					on:click={addToCart}
					class="btn w-full {selectedVariantId && selectedVariant?.quantityAvailable > 0
						? 'bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc]'
						: 'btn-disabled bg-gray-400 cursor-not-allowed'} font-poppins border-0 rounded-none py-2 px-8 flex items-center justify-center text-white shadow-sm focus:outline-none focus:ring-0"
				>
					{#if loading}
						<i class="fa regular fa-circle-notch fa-spin" />
					{:else}
						Add to Cart
					{/if}
				</button>
				<div class="text-base text-gray-700 space-y-6" />
				<div>
					{#each descrip?.blocks || [] as dec}
						<p class="text-md mt-2 font-poppins font-normal">{dec?.data?.text}</p>
					{/each}
				</div>
				<div>
					<p class="text-lg mt-2 font-semibold text-[#2b91cc]">Attributes</p>
					<div>
						<div class="grid grid-cols-2 font-poppins">
							{#each product?.attributes || [] as item}
								<div><p>{item?.attribute?.name}</p></div>
								{#each item?.values || [] as value}
									<div><div><p>{value?.name}</p></div></div>
								{/each}
							{/each}
							{#if selectedVariantId !== '' || undefined}
								{#each selectedVariant?.attributes || [] as item}
									<div><p>{item?.attribute?.name}</p></div>
									{#each item?.values || [] as value}
										<div><div><p>{value?.name}</p></div></div>
									{/each}
								{/each}
							{/if}
						</div>
					</div>
					<p />
				</div>
			</div>
		</main>
	{/if}
</div>
