<script context="module" lang="ts">
	import { KQL__Init } from '$lib/graphql/_kitql/graphqlStores';
	KQL__Init();

	import { KQL_MainMenu } from '$lib/graphql/_kitql/graphqlStores';

	// @ts-ignore
	export const load = async ({ fetch, params }) => {
		const channel = params.channel;
		const locale = params.locale;

		await KQL_MainMenu.queryLoad({
			fetch,
			variables: {
				channel,
				locale
			},
			settings: { policy: 'cache-and-network' }
		});
		return {};
	};
</script>

<script>
	import '../assets/app.css';
	import "../assets/styles/tailwind-output.css";

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// @ts-ignore
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	// NProgress Loading bar
	import 'nprogress/nprogress.css';

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

<Header />

<main>
	<slot />
</main>

<Footer />
