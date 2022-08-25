<script context="module" lang="ts">
	import { KQL_CategoryBySlug } from '$lib/graphql/_kitql/graphqlStores';

	// @ts-ignore
	export const load = async ({ fetch, params }) => {
		const channel = params.channel;
		const locale = params.locale;
		const slug = params.slug;

		//get all products of category
		await KQL_CategoryBySlug.queryLoad({
			fetch,
			variables: {
				channel,
				locale,
				slug
			},
			settings: { policy: 'network-only' }
		});
		return {};
	};
</script>

<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
</script>

<svelte:head>
	<title>{$KQL_CategoryBySlug?.data?.category?.name || ''} - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px] pb-20">
	{#if $KQL_CategoryBySlug.isFetching}
		<i class="absolute fa-regular fa-3x fa-circle-notch fa-spin -top-1 my-[330px] mx-[48%]" />
	{:else if $KQL_CategoryBySlug.errors}
		{#each $KQL_CategoryBySlug.errors as error}
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
						<a href="/default-channel/EN_US/categories" class="font-poppins text-md">Categories</a>
					</li>
					<li class="flex items-center px-1 sm:px-2 opacity-25">
						<i class="fa-regular fa-angle-right fa-md px-1" />
					</li>
					<li class="font-poppins text-md">
						{$KQL_CategoryBySlug?.data?.category?.name}
					</li>
				</ol>
			</nav>
			<div class="max-w-7xl mx-auto px-8">
				<div class="container mx-auto h-20 flex items-center">
					<div class="sm:ml-10 text-gray-50 text-center sm:text-left">
						<h1 class="text-3xl font-semibold text-black mb-2 font-poppins">
							{$KQL_CategoryBySlug?.data?.category?.name}
						</h1>
						<p class="text-lg inline-block sm:block" />
					</div>
				</div>
			</div>
		</header>
		<main>
			<div class="max-w-7xl mx-auto px-8">
				<div>
					<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{#each $KQL_CategoryBySlug.data?.category?.products?.edges || [] as product}
							<ProductCard {product} />
						{/each}
					</ul>
				</div>
			</div>
		</main>
	{/if}
</div>
