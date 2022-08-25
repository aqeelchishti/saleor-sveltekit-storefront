<script context="module" lang="ts">
	import { KQL_OrderDetailsByToken } from '$lib/graphql/_kitql/graphqlStores';
	import { getState } from '$lib/saleorClient';

	// @ts-ignore
	export const load = async ({ fetch, params }) => {
		const token = params.token;

		let userState = getState();

		//get all products of category
		await KQL_OrderDetailsByToken.queryLoad({
			fetch,
			variables: {
				token: token
			},
			settings: { policy: 'network-only' }
		});

		return {
			props: {
				userState
			}
		};
	};
</script>

<script lang="ts">
</script>

<svelte:head>
	<title>Order Created - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px] pb-20">
	{#if $KQL_OrderDetailsByToken.isFetching}
		<i class="absolute fa-regular fa-3x fa-circle-notch fa-spin -top-1 my-[330px] mx-[42.5%]" />
	{:else if $KQL_OrderDetailsByToken.errors}
		{#each $KQL_OrderDetailsByToken.errors as error}
			<p>{error.message}</p>
		{/each}
	{:else}
		<header class="mb-4 mt-4">
			<div class="max-w-7xl mx-auto px-8">
				<div class="container mx-auto h-20 flex items-center">
					<div class="sm:ml-10 text-gray-50 text-center sm:text-left">
						<h1 class="text-2xl font-semibold text-black mb-2 font-poppins">
							Order Placed Successfully
						</h1>
					</div>
				</div>
			</div>
		</header>
		<main>
			<div class="max-w-7xl mx-auto px-8 py-10 text-center items-center align-middle">
				<div class="my-3 text-center items-center align-middle">
					<h2
						class="text-green-600 font-poppins pt-2 px-4 text-center align-middle py-4 text-xl font-semibold"
					>
						Thanks for your Order
					</h2>

					<p class="font-poppins pt-2 px-4 text-center align-middle py-4 text-md font-medium">
						Order Number: {$KQL_OrderDetailsByToken.data?.orderByToken?.number} <br />
						Completion Status: {$KQL_OrderDetailsByToken.data?.orderByToken?.status} <br />
						Order Total: ${$KQL_OrderDetailsByToken.data?.orderByToken?.total.gross.amount} <br />
						Payment Status: {$KQL_OrderDetailsByToken.data?.orderByToken?.paymentStatus} <br />
						Payment Received: {$KQL_OrderDetailsByToken.data?.orderByToken?.payments[0]
							?.capturedAmount?.amount} <br />
					</p>

					<a
						href="/default-channel/EN_US/"
						class="btn mt-4 mb-3 w-[25%] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] py-2 px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm items-center justify-items-center text-center align-middle"
					>
						Continue Shopping
					</a>
				</div>
			</div>
		</main>
	{/if}
</div>
