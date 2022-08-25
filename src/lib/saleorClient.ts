import { createSaleorClient } from '@saleor/sdk';

const client = createSaleorClient({
	apiUrl:  'https://api.wemarket.click/graphql/', //'https://demo.saleor.io/graphql/', 
	channel: 'default-channel',
	
});

export const { auth, user, getState, config } = client;