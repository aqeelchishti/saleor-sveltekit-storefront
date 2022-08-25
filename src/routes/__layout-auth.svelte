<script context="module" lang="ts">
	import { KQL__Init } from '$lib/graphql/_kitql/graphqlStores';
	KQL__Init();
	import { getState } from '$lib/saleorClient';

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
	// NProgress Loading bar
	import 'nprogress/nprogress.css';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import '../assets/app.css';
	import "../assets/styles/tailwind-output.css";

	// @ts-ignore
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	export let userState: any;

	onMount(async () => {
		if (userState?.authenticated) {
			await goto('/');
		}
	});

	NProgress.configure({
		minimum: 0.75,
		showSpinner: false,
		speed: 5,
		trickleSpeed: 200
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
</script>

<svelte:head>
	<title>Saleor SvelteKit Storefront</title>
	<link
		href="https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
		rel="stylesheet"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/all.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/brands.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/duotone.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/fontawesome.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/light.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/regular.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/solid.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/codack04/github-cdn-service/font-awesome/6.1.0/css/thin.min.css"
	/>
</svelte:head>

<div class="min-h-screen bg-cover bg-center bg-gray-100">
	<div class="flex justify-center">
		<slot />
	</div>
</div>
