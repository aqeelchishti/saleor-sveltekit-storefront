<script context="module" lang="ts">
	import { KQL_ProductCollection } from '$lib/graphql/_kitql/graphqlStores';
	import { OrderDirection, ProductOrderField } from '$lib/graphql/_kitql/graphqlTypes';

	// @ts-ignore
	export const load = async ({ fetch, params, url }) => {
		const channel = params.channel;
		const locale = params.locale;
		const search = url.searchParams.get('q');
		const sortDirectionOrder = url.searchParams.get('sd');
		const sortFiledName = url.searchParams.get('sn');

		//get collections
		await KQL_ProductCollection.queryLoad({
			fetch,
			variables: {
				channel: channel,
				locale: locale,
				searchFilter: search,
				directionOrder: sortDirectionOrder,
				fieldName: sortFiledName
			},
			settings: { policy: 'network-only' }
		});
		return {
			props: {
				search,
				sortDirectionOrder,
				sortFiledName
			}
		};
	};
</script>

<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { goto } from '$app/navigation';

	export let search: string;
	export let sortDirectionOrder: OrderDirection;
	export let sortFiledName: ProductOrderField;

	const sortListOptions = [
		{ name: 'Sort By' },
		{ name: 'Price Low-High' },
		{ name: 'Price High-Low' },
		{ name: 'Name Ascending' },
		{ name: 'Name Descending' },
		{ name: 'Last Update Ascending' },
		{ name: 'Last Update Descending' }
	];

	let sortValue = 'Sort By';

	const startfilter = async () => {
		switch (sortValue) {
			case 'Sort By':
				sortDirectionOrder = OrderDirection.Asc;
				sortFiledName = ProductOrderField.Published;
				break;
			case 'Price Low-High':
				sortDirectionOrder = OrderDirection.Asc;
				sortFiledName = ProductOrderField.Price;
				break;
			case 'Price High-Low':
				sortDirectionOrder = OrderDirection.Desc;
				sortFiledName = ProductOrderField.Price;
				break;
			case 'Name Ascending':
				sortDirectionOrder = OrderDirection.Asc;
				sortFiledName = ProductOrderField.Name;
				break;
			case 'Name Descending':
				sortDirectionOrder = OrderDirection.Desc;
				sortFiledName = ProductOrderField.Name;
				break;
			case 'Last Update Ascending':
				sortDirectionOrder = OrderDirection.Asc;
				sortFiledName = ProductOrderField.LastModified;
				break;
			case 'Last Update Descending':
				sortDirectionOrder = OrderDirection.Desc;
				sortFiledName = ProductOrderField.LastModified;
				break;
			default:
				break;
		}

		await goto(
			`/default-channel/EN_US/search?q=${search}&sd=${sortDirectionOrder}&sn=${sortFiledName}`,
			{
				keepfocus: true
			}
		);
		console.log(search);
		console.log($KQL_ProductCollection.data);
	};
</script>

<svelte:head>
	<title>Search - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px]">
	<main class="max-w-7xl mx-auto w-full px-8 mt-10 mb-24">
		<p class="font-semibold font-poppins text-2xl mb-2">Search</p>
		<div class="flex md:sm:shrink space-x-px md:space-x-80 items-center w-full py-3 mb-3">
			<input
				class="flex-auto md:shrink w-[48%] md:w-[60%] px-4 border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
				type="text"
				placeholder="Search products"
				bind:value={search}
				on:input={startfilter}
			/>

			<select
				bind:value={sortValue}
				on:change={startfilter}
				class="flex-auto md:shrink w-[10%] md:w-[20%] px-4 border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
			>
				{#each sortListOptions as item}
					<option value={item.name}>{item.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<p class="font-medium font-poppins text-md text-left mb-4">
				{$KQL_ProductCollection.data?.products?.edges.length || 0} Products Found
			</p>
			<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{#if $KQL_ProductCollection.isFetching}
					<i
						class="absolute fa-regular fa-3x fa-circle-notch fa-spin -top-1 my-[410px] md:my-[410px] mx-[40%]"
					/>
				{:else if $KQL_ProductCollection.errors}
					{#each $KQL_ProductCollection.errors as error}
						<p>{error.message}</p>
					{/each}
				{:else}
					{#each $KQL_ProductCollection.data?.products?.edges ?? [] as product}
						<ProductCard {product} />
					{:else}
						<div class="text-center py-[160px] px-[32rem] md:px-[16rem] ">
							<p class="font-poppins text-center">No Products Found</p>
						</div>
					{/each}
				{/if}
			</ul>
		</div>
	</main>
</div>
