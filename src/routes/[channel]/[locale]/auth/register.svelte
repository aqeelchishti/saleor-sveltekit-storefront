<script context="module" lang="ts">
	import { auth, getState } from '$lib/saleorClient';
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
	import { KQL_RegisterAccount } from '$lib/graphql/_kitql/graphqlStores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let userState: any;

	// button loading
	let loading = false;

	onMount(async () => {
		if (userState?.authenticated && $tokenIsValid) {
			await goto('/');
		}
	});

	let email: string = '';
	let password: string = '';
	let errorMessage: string = '';
	let messageIndication: boolean;

	const register = async () => {
		loading = true;
		if (email !== '' && password !== '') {
			const result = await KQL_RegisterAccount.mutate({
				variables: {
					email: email,
					password: password,
					redirectUrl: 'http://localhost:3000/default-channel/EN_US/auth/email-confirm'
				}
			});
			if (result.data?.accountRegister?.errors.length) {
				messageIndication = false;
				result.data?.accountRegister?.errors.forEach((e) => {
					if (e.field === 'email') {
						errorMessage = e.message + '';
					} else if (e.field === 'password') {
						errorMessage = e.message + '';
					} else {
						errorMessage = `Registration error: ${e}`;
					}
				});
			} else {
				errorMessage = 'Check your email to confirm account';
				messageIndication = true;
			}
		} else {
			errorMessage = 'All fields are required *';
			messageIndication = false;
		}
		setTimeout(() => (loading = false), 1000);
	};
</script>

<svelte:head>
	<title>Register - Saleor SvelteKit Storefront</title>
</svelte:head>

<div>
	<form on:submit|preventDefault={register}>
		<div>
			<h1 class="text-2xl font-semibold font-poppins">Create a new account</h1>
		</div>
		<div class="my-3">
			<label for="email" class="block text-md mb-2 font-poppins">Email</label><input
				class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
				type="email"
				bind:value={email}
			/>
		</div>
		<div class="mt-5">
			<label for="password" class="block text-md mb-2 font-poppins">Password</label><input
				class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
				type="password"
				bind:value={password}
			/>
		</div>
		<div class="">
			<button
				type="submit"
				class="btn mt-4 mb-3 w-full bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] py-2 px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm"
			>
				{#if loading}
					<i class="fa regular fa-circle-notch fa-spin" />
				{:else}
					Register
				{/if}
			</button>
			{#if errorMessage}
				<p
					class="text-sm font-poppins {messageIndication
						? 'text-green-500'
						: 'text-red-500'} pt-2 w-[80%]"
				>
					{errorMessage}
				</p>
			{/if}
		</div>
	</form>
	<p class="mt-8">
		<a href="/default-channel/EN_US/auth/login" class="font-poppins">Log in to existing account</a>
	</p>
</div>
