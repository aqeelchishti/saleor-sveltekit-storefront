<script context="module" lang="ts">
	import { KQL_ConfirmEmailChange } from '$lib/graphql/_kitql/graphqlStores';
	import { tokenIsValid } from '../../../../store/authStore';

	// @ts-ignore
	export const load = async ({ url }) => {
		const tokenGet = url.searchParams.get('token');

		if (tokenIsValid) {
			await KQL_ConfirmEmailChange.mutate({
				variables: {
					token: tokenGet
				}
			});
		}

		return {};
	};
</script>

<script lang="ts">
	let newEmail = $KQL_ConfirmEmailChange.data?.confirmEmailChange?.user?.email || "";
</script>

<div class="my-3">
	<p class="font-poppins pt-2 px-4 text-center py-4 text-lg font-normal">
		<span class="text-green-500 font-medium">{newEmail}</span><br /> Email change has been successfully confirmed.
		<br /> Now you can go back to account settings page.
	</p>
	<a
		href="/default-channel/EN_US/account/settings"
		class="btn mt-4 mb-3 w-[60%] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] py-2 px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm text-center items-center justify-items-center ml-14"
	>
		Go to Settings
	</a>
</div>
