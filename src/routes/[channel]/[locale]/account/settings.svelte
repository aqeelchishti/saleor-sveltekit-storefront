<script context="module" lang="ts">
	import {
		KQL_CurrentUserDetails,
		KQL_AccountUpdate,
		KQL_PasswordChange,
		KQL_VerifyToken
	} from '$lib/graphql/_kitql/graphqlStores';
	import { getUserToken } from '../../../../store/stores';
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

	let firstName: string = currentUser?.firstName ? currentUser?.firstName : '';
	let lastName: string = currentUser?.lastName ? currentUser?.lastName : '';

	let oldPassword: string = '';
	let newPassword: string = '';
	let repeatNewPassword: string = '';

	let uErrorMessage: string = '';
	let uMessageIndication: boolean;

	let pErrorMessage: string = '';
	let pMessageIndication: boolean;

	let loading1: boolean,
		loading3: boolean
	= false;

	const updateAccount = async () => {
		loading1 = true;
		if (firstName !== '' && lastName !== '') {
			const verifyTok = await KQL_VerifyToken.mutate({
				variables: {
					token: $getUserToken
				}
			});
			if (verifyTok.data?.tokenVerify?.isValid) {
					const result = await KQL_AccountUpdate.mutate({
						variables: {
							firstName: firstName,
							lastName: lastName
						}
					});
					if (result.data?.accountUpdate?.errors[0]) {
						uErrorMessage = result.data?.accountUpdate?.errors[0].message + '';
						uMessageIndication = false;
					} else {
						uErrorMessage = 'Account Updated Successfully';
						uMessageIndication = true;

						firstName = currentUser?.firstName ? currentUser?.firstName : '';
						lastName = currentUser?.lastName ? currentUser?.lastName : '';
					}
			}
		}	
		else {
				uErrorMessage = 'All fields are required *';
				uMessageIndication = false;
		}
		pErrorMessage = '';
		setTimeout(() => (loading1 = false), 1000);
	};

	
	const changePassword = async () => {
		loading3 = true;
		if (oldPassword !== '' && newPassword !== '') {
			if (newPassword === repeatNewPassword) {
				const verifyTok = await KQL_VerifyToken.mutate({
					variables: {
						token: $getUserToken
					}
				});
				if (verifyTok.data?.tokenVerify?.isValid) {
					const result = await KQL_PasswordChange.mutate({
						variables: {
							oldPassword: oldPassword,
							newPassword: newPassword
						}
					});
					if (result.data?.passwordChange?.errors[0]) {
						pErrorMessage = result.data?.passwordChange?.errors[0].message + '';
						pMessageIndication = false;
					} else {
						pErrorMessage = 'Password Changed Successfully';
						pMessageIndication = true;
					}
				}
			}
			else {
				pErrorMessage = 'Repeat Password Not Matched';
				pMessageIndication = false;
			}
		} else {
			pErrorMessage = 'All fields are required *';
			pMessageIndication = false;
		}
		uErrorMessage = '';
		setTimeout(() => (loading3 = false), 1000);
	};
</script>

<div class="flex flex-initial w-full flex-col overflow-y-auto md:mx-3 space-y-1">
	<div class="bg-gray-100 px-8 py-2">
		<div class="mt-4 mb-4">
			<h2 class="mb-2 font-poppins font-medium text-lg pb-5">Personal Details</h2>
			<form on:submit|preventDefault={updateAccount}>
				<div class="grid grid-cols-12 gap-4 w-full pb-4">
					<div class="col-span-full sm:col-span-6">
						<div class="mt-1">
							<input
								type="text"
								placeholder="First Name*"
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								bind:value={firstName}
							/>
						</div>
					</div>
					<div class="col-span-full sm:col-span-6">
						<div class="mt-1">
							<input
								type="text"
								placeholder="Last Name*"
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								bind:value={lastName}
							/>
						</div>
					</div>
				</div>

				<div class="col-span-full flex justify-end items-end space-x-6">
					{#if uErrorMessage}
						<p
							class="text-sm font-poppins {uMessageIndication
								? 'text-green-500'
								: 'text-red-500'} pb-5"
						>
							{uErrorMessage}
						</p>
					{/if}
					<button
						type="submit"
						class="btn mt-4 mb-3 w-24 min-h-[2.2rem] h-[2.4rem] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm"
					>
					{#if loading1}
						<i class="fa regular fa-circle-notch fa-spin" />
					{:else}
						Update
					{/if}
					</button>
				</div>
			</form>
		</div>
	</div>

	<!--<div class="bg-gray-100 px-8 py-2">
		<div class="mt-4 mb-4">
			<h2 class="mb-2 font-poppins font-medium text-lg pb-5">Change Email Address</h2>
			<form on:submit|preventDefault={updateEmail}>
				<div class="grid grid-cols-12 gap-4 w-full pb-4">
					<div class="col-span-full sm:col-span-6">
						<div class="mt-1">
							<input
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								type="email"
								placeholder="Email Address*"
								bind:value={newEmail}
								default={userState.user.email}
							/>
						</div>
					</div>

					<div class="col-span-full sm:col-span-6">
						<div class="mt-1">
							<input
								placeholder="Current password*"
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								type="password"
								bind:value={password}
							/>
						</div>
					</div>
				</div>

				<div class="col-span-full flex justify-end items-end space-x-6">
					{#if eErrorMessage}
						<p
							class="text-sm font-poppins {eMessageIndication
								? 'text-green-500'
								: 'text-red-500'} pb-5"
						>
							{eErrorMessage}
						</p>
					{/if}
					<button
						type="submit"
						class="btn mt-4 mb-3 w-24 min-h-[2.2rem] h-[2.4rem] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm"
					>{#if loading2}
						<i class="fa regular fa-circle-notch fa-spin" />
					{:else}
						Update
					{/if}
					</button>
				</div>
			</form>
		</div>
	</div>-->

	<div class="bg-gray-100 px-8 py-2">
		<div class="mt-4 mb-4">
			<h2 class="mb-2 font-poppins font-medium text-lg pb-5">Change Password</h2>
			<form on:submit|preventDefault={changePassword}>
				<div class="grid grid-cols-12 gap-4 w-full pb-4">
					<div class="col-span-full">
						<div class="mt-1">
							<input
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								type="password"
								placeholder="Old Password*"
								bind:value={oldPassword}
							/>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-12 gap-4 w-full pb-4">
					<div class="col-span-full">
						<div class="mt-1">
							<input
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								type="password"
								placeholder="New Password*"
								bind:value={newPassword}
							/>
						</div>
					</div>

					<div class="col-span-full">
						<div class="mt-1">
							<input
								class="px-4 w-full border-0 py-2 rounded-none text-sm outline-none font-poppins focus:ring-2 focus:ring-[#2b91cc] shadow-sm"
								type="password"
								placeholder="Repeat New Password*"
								bind:value={repeatNewPassword}
							/>
						</div>
					</div>
				</div>

				<div class="col-span-full flex justify-end items-end space-x-6">
					{#if pErrorMessage}
						<p
							class="text-sm font-poppins {pMessageIndication
								? 'text-green-500'
								: 'text-red-500'} pb-5"
						>
							{pErrorMessage}
						</p>
					{/if}
					<button
						type="submit"
						class="btn mt-4 mb-3 w-24 min-h-[2.2rem] h-[2.4rem] bg-[#2b91cc] hover:bg-[#2b91cc] hover:border-[#2b91cc] px-8 text-white border-0 rounded-none font-poppins focus:ring-0 shadow-sm"
					>
					{#if loading3}
						<i class="fa regular fa-circle-notch fa-spin" />
					{:else}
						Update
					{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
