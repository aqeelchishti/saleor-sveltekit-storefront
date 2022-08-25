<script context="module" lang="ts">
	// @ts-ignore
	export const load = ({ error, status }) => {
		return {
			props: {
				error,
				status
			}
		};
	};
</script>

<script lang="ts">
	export let error: any;
	export let status: any;
</script>

<div class="bg-gray-100 min-h-screen w-100 flex justify-center items-center">
	<div class="my-3">
		<p class="font-poppins pt-2 px-4 text-center py-4 text-lg font-normal">
			{error.name}
			{status} <br />
			{error.message}
		</p>
	</div>
</div>
