<script context="module" lang="ts">
	import { KQL_CategoryPaths } from '$lib/graphql/_kitql/graphqlStores';

	// @ts-ignore
	export const load = async ({ fetch, params }) => {
		const channel = params.channel;

		//get categories
		await KQL_CategoryPaths.queryLoad({
			fetch,
			variables: {
				channel
			},
			settings: { policy: 'cache-and-network' }
		});
		return {};
	};
</script>

<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
</script>

<svelte:head>
	<title>Categories - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px]">
	<div class="mt-10 mb-5">
		{#if $KQL_CategoryPaths.isFetching}
			<i class="absolute fa-regular fa-3x fa-circle-notch fa-spin -top-1 my-[354px] mx-[48%]" />
		{:else if $KQL_CategoryPaths.errors}
			{#each $KQL_CategoryPaths.errors as error}
				<p>{error.message}</p>
			{/each}
		{:else}
			<main>
				<div class="max-w-7xl mx-auto px-8">
					{#each $KQL_CategoryPaths.data?.categories?.edges.slice(0, 3) || [] as category}
						<div class="pb-8">
							<h1 class="text-2xl font-semibold font-poppins tracking-tight text-gray-900 pb-10">
								{category?.node?.name}
							</h1>
							<div>
								<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									{#each category?.node?.products?.edges.slice(0, 4) || [] as product}
										<ProductCard {product} />
									{/each}
								</ul>
							</div>
							<div class="flex flex-row-reverse p-4">
								<a
									sveltekit:prefetch
									href={`/default-channel/EN_US/category/${category?.node?.slug}`}
									class="font-poppins text-[#2b91cc]"><p>View More →</p></a
								>
							</div>
						</div>
					{/each}
				</div>
			</main>
		{/if}
	</div>
</div>
