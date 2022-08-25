<script>
	// @ts-nocheck

	import Skeleton from 'svelte-skeleton/Skeleton.svelte';

	// @ts-ignore
	export let product;

	let getProduct = async () => {
		// @ts-ignore
		const prod = await product;
		if (prod) {
			return prod;
		}
	};

	let promise = getProduct();
</script>

{#await promise}
	<div class="relative bg-gray-50 border shadow-md hover:shadow-2xl">
		<Skeleton width="290" height="321">
			<i class="absolute fa-regular fa-2x fa-circle-notch fa-spin -top-1 my-36 mx-[126px]" />
		</Skeleton>
	</div>
{:then product}
	<li class="relative bg-white shadow-md hover:shadow-2xl">
		<a sveltekit:prefetch href={`/default-channel/EN_US/product/${product?.node?.slug}?vid=`}
			><div
				class="flex flex-col w-full h-60 bg-gray-200"
				style="background-image: url(&quot;{product?.node?.thumbnail
					?.url}&quot;); background-size: auto; background-repeat: no-repeat; background-position: center center;"
			>
				<br />
				{#if product?.node?.pricing?.onSale}
					<div
						class="bg-red-600 font-poppins text-white w-1/4 text-center rounded-r-[11px] shadow-lg"
					>
						Sale
					</div>
				{/if}
			</div>
			<div class="px-4 py-2 border-gray-100 bg-white border-t">
				<p class="block font-poppins text-lg text-black truncate">{product?.node?.name}</p>
				<p class="block font-poppins text-sm font-medium text-[#2b91cc]">
					{product?.node?.category?.name}
				</p>
				<p class="block font-poppins text-xs font-medium text-black">
					from ${product?.node?.pricing?.priceRange?.start?.gross?.amount}
				</p>
			</div>
		</a>
	</li>
{/await}
