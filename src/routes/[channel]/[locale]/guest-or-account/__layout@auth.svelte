<script context="module" lang="ts">
	import { getState } from '$lib/saleorClient';
	import { getCheckoutToken } from '../../../../store/stores';

	// @ts-ignore
	export const load = async () => {
		let userState = getState();
		return {
			props: {
				userState
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let userState: any;

	onMount(async () => {
		if (userState?.authenticated) {
			await goto(`/default-channel/EN_US/checkout/address?token=${$getCheckoutToken}`);
		}
	});
</script>

<div
	class="min-h-screen bg-gray-100 align-middle flex justify-center items-center flex-grow pt-[60px] pb-20"
>
	{#if !userState?.authenticated}
		<div class="flex justify-center py-16 px-24">
			<div class="w-[45%] py-14 px-16">
				<h1 class="text-2xl font-semibold font-poppins">Continue as guest</h1>
				<p class="mt-8">
					If you don't wish to register an account, don't worry. You can checkout as a guest. We
					care about you just as much as any registered user.
				</p>
				<p class="mt-4">
					<a
						href={`/default-channel/EN_US/checkout/address?token=${$getCheckoutToken}`}
						class="btn mt-4 mb-3 w-full bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] py-2 px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm"
					>
						Continue as Guest
					</a>
				</p>
			</div>
			<div class="w-[45%] py-14 px-16">
				<slot />
			</div>
		</div>
	{/if}
</div>
