
import { KQL_VerifyToken } from '$lib/graphql/_kitql/graphqlStores';
import { getUserToken } from '../store/stores';
import { writable } from 'svelte/store';

let setUserToken: any;
getUserToken.subscribe((val) => (setUserToken = val));

const verifyTok = await KQL_VerifyToken.mutate({
    variables: {
        token: setUserToken
    }
});
export const tokenIsValid = writable(verifyTok.data?.tokenVerify?.isValid);