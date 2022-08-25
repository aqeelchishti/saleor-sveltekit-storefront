<script context="module" lang="ts">
	import { KQL_ConfirmAccount } from '$lib/graphql/_kitql/graphqlStores';

	// @ts-ignore
	export const load = async ({ url }) => {
		const email = url.searchParams.get('email');
		const token = url.searchParams.get('token');

		//get collections
		await KQL_ConfirmAccount.mutate({
			variables: {
				email: email,
				token: token
			}
		});
		return {
			props: {
				email
			}
		};
	};
</script>

<script lang="ts">
	export let email: any;
</script>

<div class="my-3">
	<p class="font-poppins pt-2 px-4 text-center py-4 text-lg font-normal">
		<span class="text-green-500 font-medium">{email}</span><br /> has been successfully confirmed.
		<br /> Now you can login to your account
	</p>
	<a
		href="/default-channel/EN_US/auth/login"
		class="btn mt-4 mb-3 w-[60%] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] py-2 px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm text-center items-center justify-items-center ml-14"
	>
		Log in
	</a>
</div>
