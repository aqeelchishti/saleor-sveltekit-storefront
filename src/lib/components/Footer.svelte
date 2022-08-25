<script lang="ts">
	import saleor_logo from '../../assets/saleor.svg';
</script>

<footer class="py-10 px-14">
	<div class="">
		<div class="flex mb-14 sm:mb-10">
			<a href="/default-channel/EN_US/" class="hidden sm:inline-block"
				><div class="mt-px group block h-16 w-28 relative">
					<span
						style="box-sizing:border-box;display:block;overflow:hidden;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0;position:absolute;top:0;left:0;bottom:0;right:0"
						><img
							alt="Saleor logo"
							src={saleor_logo}
							style="position:absolute;top:0;left:0;bottom:0;right:0;box-sizing:border-box;padding:0;border:none;margin:auto;display:block;width:0;height:0;min-width:100%;max-width:100%;min-height:100%;max-height:100%"
						/></span
					>
				</div></a
			>
			<div
				class="grid grid-cols-2 gap-[2rem] w-full sm:w-auto sm:flex sm:flex-wrap sm:justify-end sm:ml-auto"
			>
				<div class="sm:ml-14">
					<a
						href="/"
						class="block text-md font-semibold mb-4 cursor-pointer font-poppins hover:underline"
						>Collections</a
					>
					<ul>
						<li>
							<a
								href="/default-channel/EN_US/collection/featured-products"
								class="text-md font-poppins">Featured Products</a
							>
						</li>
						<li>
							<a
								href="/default-channel/EN_US/collection/summer-collection"
								class="text-md font-poppins">Summer Collection</a
							>
						</li>
					</ul>
				</div>
				<div class="sm:ml-14">
					<a
						href="/"
						class="block text-md font-semibold mb-4 cursor-pointer font-poppins hover:underline"
						>Saleor</a
					>
					<ul>
						<li>
							<a href="https://demo.saleor.io/graphql/" target="_blank" class="text-md font-poppins"
								>GraphQL API</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<p class="text-sm text-main-3 font-poppins">
			© Copyright 2018 - 2022 Saleor SvelteKit Storefront
		</p>
	</div>
</footer>
