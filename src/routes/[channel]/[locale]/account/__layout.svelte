<script context="module" lang="ts">
	import { getState } from '$lib/saleorClient';
	import { tokenIsValid } from '../../../../store/authStore';

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
		if (!userState?.authenticated && !$tokenIsValid) {
			await goto('/default-channel/EN_US/auth/login');
		}
	});

	let active = false;
</script>

<svelte:head>
	<title>My Account - Saleor SvelteKit Storefront</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow pt-[60px] pb-20">
	{#if userState?.authenticated}
		<header class="mb-4 mt-4">
			<nav class="max-w-7xl mx-auto px-8 mt-2">
				<ol class="flex items-center">
					<li>
						<a href="/default-channel/EN_US/" class="font-poppins text-md">Home</a>
					</li>
					<li class="flex items-center px-1 sm:px-2 opacity-25">
						<i class="fa-regular fa-angle-right fa-md px-1" />
					</li>
					<li class="font-poppins text-md">My Account</li>
				</ol>
			</nav>

			<div class="max-w-7xl mx-auto px-8">
				<div class="container mx-auto h-20 flex items-center">
					<div class="sm:ml-10 text-gray-50 text-center sm:text-left">
						<h1 class="text-3xl font-semibold text-black mb-2 font-poppins">My Account</h1>
					</div>
				</div>
			</div>
		</header>
		<main class="flex flex-col md:flex-row container w-full mx-auto px-8 space-x-">
			<div class="mb-2 flex-initial md:w-2/6 px-6 py-6 bg-white shadow-sm mx-3 md:mx-3">
				<nav class="space-y-1">
					<a
						href="/default-channel/EN_US/account/settings"
						class="flex items-center space-x-3 px-3 {active
							? 'text-[#2b91cc] font-medium'
							: 'text-black font-normal hover:text-[#2b91cc]'}"
					>
						<i class="fa-regular fa-sliders-up fa-lg pr-2" />
						<span class="py-2 grow">Account Settings</span>
					</a>
					<a
						href="/default-channel/EN_US/account/orders"
						class="flex items-center space-x-3 px-3 {active
							? 'text-[#2b91cc] font-medium'
							: 'text-black font-normal hover:text-[#2b91cc]'}"
					>
						<i class="fa-regular fa-clock-rotate-left fa-lg pr-2" />
						<span class="py-2 grow">Orders History</span>
					</a>
				</nav>
			</div>
			<slot />
		</main>
	{:else}
		<i class="absolute fa-regular fa-3x fa-circle-notch fa-spin -top-1 my-[330px] mx-[42.5%]" />
	{/if}
</div>
