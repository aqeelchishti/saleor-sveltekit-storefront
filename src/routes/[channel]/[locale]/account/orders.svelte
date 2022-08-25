<script context="module" lang="ts">
	import {
		KQL_CurrentUserDetails,
		KQL_VerifyToken
	} from '$lib/graphql/_kitql/graphqlStores';
	import { tokenIsValid } from '../../../../store/authStore';

	// @ts-ignore
	export const load = async ({ fetch }) => {
		
		if (tokenIsValid) {
			await KQL_CurrentUserDetails.queryLoad({ fetch });
		}

		return {};
	};
</script>

<script lang="ts">

	let currentUser = $KQL_CurrentUserDetails.data?.me;

	console.log(currentUser);

</script>


<div class="flex flex-initial w-full flex-col overflow-y-auto md:mx-3 space-y-1">
	<div class="bg-gray-100 px-8 py-2">
		<div class="mt-4 mb-4">
			<h2 class="mb-2 font-poppins font-medium text-lg pb-5">Orders</h2>

			<div class="flex flex-initial w-full flex-col overflow-y-auto md:px-4 space-y-4">
				<table class="w-full divide-y bg-white rounded-md ">
					<thead class="text-center h-16">
                        <tr>
                            <th class="w-1/4 font-semibold text-md">Number</th>
                            <th class="w-1/4 font-semibold text-md">Date</th>
                            <th class="w-1/4 font-semibold text-md md:text-center hidden md:table-cell">Status</th>
                            <th class="w-1/4 font-semibold text-md">Total</th>
                        </tr>
                    </thead>
                    <tbody class="text-center divide-y">
                        {#each $KQL_CurrentUserDetails.data?.me?.orders?.edges || [] as order}
                            <tr class="h-16 cursor-pointer">
                                <td>{order?.node?.number}</td>
                                <td>{order?.node?.created}</td>
                                <td class="hidden md:table-cell">{order?.node?.status}</td>
                                <td>${order?.node?.total?.gross?.amount}</td>
                            </tr>
						{:else}
							<tr>
								No orders
							</tr>
                        {/each}
                    </tbody>
				</table>
				
			</div>

		</div>
	</div>
</div>
