<script context="module" lang="ts">
	import { KQL_MainMenu } from '$lib/graphql/_kitql/graphqlStores';
	import { OrderDirection, ProductOrderField } from '$lib/graphql/_kitql/graphqlTypes';
	import { cartLength } from '../../store/stores';
	import { auth, getState } from '$lib/saleorClient';

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
	import saleor_logo from '../../assets/saleor.svg';
	import { goto } from '$app/navigation';
	import { kitQLClient, defaultHeaders, type AppHeaders } from '$lib/graphql/kitQLClient';

	export let userState: any;

	userState = getState();

	//logout
	const logout = async () => {
		await auth.logout();
		userState = getState();

		(kitQLClient.headers as AppHeaders) = defaultHeaders

		await goto('/');
	};

	// menus
	let catMenuOpen = false;
	let userMenuOpen = false;

	function toggleCatMenu() {
		catMenuOpen = !catMenuOpen;
	}

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	export let search = '';
	export let sortDirectionOrder = OrderDirection.Asc;
	export let sortFiledName = ProductOrderField.Published;
</script>

<div class="bg-white shadow-sm fixed left-0 right-0 z-[100] top-0">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex justify-between h-16">
			<div class="flex justify-between items-center">
				<div class="group relative justify-center flex flex-col">
					<button
						on:click={toggleCatMenu}
						class="btn btn-ghost text-black hover:bg-white text-center pt-1"
					>
						<i class="fa-regular text-black text-2xl fa-bars" />
					</button>

					{#if catMenuOpen}
						<div
							class="z-40 dropdown-menu transition-all duration-300 transform origin-top-left -translate-y-2 scale-95 -top-1"
						>
							<div
								class="mt-3 mr-2 -ml-2 md:mx-3 z-40 absolute h-screen w-screen lg:max-w-7xl md:h-56 bg-white border border-gray-200 rounded-none shadow-lg outline-none"
							>
								<div
									class="flex flex-col md:flex-row cursor-default md:divide-x md:divide-gray-200"
								>
									{#each $KQL_MainMenu.data?.menu?.items ?? [] as category}
										<div class="h-32 md:pl-10 ml-5 md:ml-16 mt-10">
											<h2 class="font-semibold font-poppins text-md">{category?.name}</h2>
											<ul class="mt-3 absolute">
												{#each category?.children ?? [] as sub_category}
													<li>
														<a
															on:click={toggleCatMenu}
															href={`/default-channel/EN_US/category/${sub_category?.category?.slug}`}
															class="ml-3 text-black hover:font-medium font-poppins hover:text-[#2b91cc]"
															>{sub_category?.name}</a
														>
													</li>
												{/each}
											</ul>
										</div>
									{/each}
								</div>
								<div class="flex flex-row-reverse p-4">
									<a
										on:click={toggleCatMenu}
										href="/default-channel/EN_US/categories"
										class="font-semibold font-poppins text-[#2b91cc]"
										><p>View all Categories →</p></a
									>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<a href="/default-channel/EN_US/"
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
			</div>
			<div class="flex space-x-px md:space-x-2 items-center">
				<a
					on:click={() => {catMenuOpen = false, userMenuOpen = false}}
					href={`/default-channel/EN_US/search?q=${search}&sd=${sortDirectionOrder}&sn=${sortFiledName}`}
					class="btn btn-ghost hover:bg-white group p-2 flex items-center pt-[10px]"
				>
					<i class="fa-regular fa-search fa-xl text-black" />
				</a>

				<a
					on:click={() => {catMenuOpen = false, userMenuOpen = false}}
					href="/default-channel/EN_US/cart"
					class="btn btn-ghost hover:bg-white group -m-2 p-2 flex items-center pt-[10px]"
				>
					<i class="fa-regular fa-bag-shopping fa-xl text-black" />
					{#if $cartLength > 0}
						<span
							class="-mt-3 -ml-1 text-xs font-poppins font-medium text-white bg-[#2b91cc] rounded-full px-[6.5px] py-[2px]"
						>
							{$cartLength}
						</span>
					{:else}
						<!---->
					{/if}
				</a>
				{#if userState?.authenticated}
					<button
						on:click={toggleUserMenu}
						class="btn btn-ghost hover:bg-white group -my-2 -mr-2 -ml-3 p-2 flex items-center pt-[10px]"
					>
						<i class="fa-regular fa-user-large fa-xl text-black" />
					</button>
					{#if userMenuOpen}
						<div
							class="absolute right-14 origin-top-right mt-2 w-42 bg-white shadow-sm z-[100] top-[3.52rem]"
						>
							<div class="divide-y">
								<div class="p-2 space-y-1">
									<a
										on:click={toggleUserMenu}
										href="/default-channel/EN_US/account/settings"
										class="flex items-center space-x-2 py-2 px-3 font-poppins text-sm font-normal focus:outline-none text-black"
									>
										<i class="fa-regular fa-gear text-black pr-2" />
										<span>My Account</span>
									</a>

									<a
										on:click={toggleUserMenu}
										href="/default-channel/EN_US/account/orders"
										class="flex items-center space-x-2 py-2 px-3 font-poppins text-sm font-normal focus:outline-none text-black"
									>
										<i class="fa-regular fa-clock-rotate-left text-black pr-2" />
										<span>Order History</span>
									</a>
									<button
										on:click={logout}
										class="w-full text-left flex items-center space-x-2 py-2 px-3 font-poppins text-sm font-normal focus:outline-none text-black"
									>
										<i class="fa-regular fa-arrow-right-from-bracket text-black pr-2" />
										<span>Logout</span>
									</button>
								</div>
							</div>
						</div>
					{/if}
					
				{:else if !(userState?.authenticated)}
					<a
						href="/default-channel/EN_US/auth/login"
						class="btn btn-ghost hover:bg-white group -m-2 p-2 flex items-center pt-[10px]"
					>
						<i class="fa-regular fa-arrow-right-to-bracket fa-xl text-black" />
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>
