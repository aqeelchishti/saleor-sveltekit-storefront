<script context="module" lang="ts">
	import { KQL_CurrentUserDetails, KQL_VerifyToken, KQL_CreateToken, KQL_RefreshToken } from '$lib/graphql/_kitql/graphqlStores';
	import { auth, getState } from '$lib/saleorClient';
	import { getUserToken } from '../../../../store/stores';
	import { tokenIsValid } from '../../../../store/authStore';
	import { kitQLClient, type AppHeaders } from '$lib/graphql/kitQLClient';

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

	// button loading
	let loading = false;

	onMount(async () => {

		if ($tokenIsValid && userState?.authenticated) {
			await goto('/');
		}
	});

	let email: string = '';
	let password: string = '';
	let errorMessage: string = '';
	let messageIndication: boolean;

	const login = async () => {
		loading = true;
		if (email !== '' && password !== '') {
			const result = await auth.login({
				email: email,
				password: password
			});
			userState = getState();
			if (result.data?.tokenCreate?.errors[0]) {
				errorMessage = result.data?.tokenCreate?.errors[0].message + '';
				messageIndication = false;
			} else {

				const res = KQL_RefreshToken.mutate({
					variables: {
						refreshToken: result.data?.tokenCreate?.refreshToken
					}
				});

				$getUserToken = result.data?.tokenCreate?.token || "";

				if (tokenIsValid) {
					errorMessage = 'Successfully Logged In';
					messageIndication = true;
					await goto('/');
					
					(kitQLClient.headers as AppHeaders) = { 
						Authorization: `JWT ${$getUserToken}`
					};
					
					const userData = await KQL_CurrentUserDetails.query();
					console.log(userData);
				}
			}
			userState = getState();
		} else {
			errorMessage = 'All fields are required *';
			messageIndication = false;
		}
		setTimeout(() => (loading = false), 1000);
	};

</script>

<svelte:head>
	<title>Login - Saleor SvelteKit Storefront</title>
</svelte:head>

<div>
	<form on:submit|preventDefault={login}>
		<div>
			<span class="text-lg text-[#2b91cc] font-poppins">Welcome back</span>
			<h1 class="text-2xl font-semibold font-poppins">Login to your account</h1>
		</div>
		<div class="my-3">
			<label for="email" class="block text-md mb-2 font-poppins">Email</label>
			<input
				class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
				type="email"
				bind:value={email}
			/>
		</div>
		<div class="mt-5">
			<label for="password" class="block text-md mb-2 font-poppins">Password</label>
			<input
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
					Log in
				{/if}
			</button>
			{#if errorMessage}
				<p
					class="text-sm font-poppins {messageIndication ? 'text-green-500' : 'text-red-500'} pt-2"
				>
					{errorMessage}
				</p>
			{/if}
		</div>
	</form>
	<p class="mt-8">
		<a href="/default-channel/EN_US/auth/register" class="font-poppins">Register a new account</a>
	</p>
</div>
