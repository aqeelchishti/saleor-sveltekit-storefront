<script context="module" lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { getCheckoutToken, cartLength, cart, checkout } from '../../../../store/stores';

	// @ts-ignore
	export const load = async () => {
		if (browser) {
			if (!cart && !getCheckoutToken) {
				await goto('/default-channel/EN_US/cart');
			}
		}
		return {};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!$cart && !$getCheckoutToken) {
			await goto('/default-channel/EN_US/cart');
		}
	});
</script>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px] pb-20">
	<header class="mb-4 mt-4">
		<div class="max-w-7xl mx-auto px-8">
			<div class="container mx-auto h-20 flex items-center">
				<div class="sm:ml-10 text-gray-50 text-center sm:text-left">
					<h1 class="text-2xl font-semibold text-black mb-2 font-poppins">Checkout</h1>
				</div>
			</div>
		</div>
	</header>
	<slot />
</div>
