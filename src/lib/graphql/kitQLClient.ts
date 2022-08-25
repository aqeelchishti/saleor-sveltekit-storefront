import { KitQLClient } from '@kitql/client';

export type AppHeaders = {
	Authorization: `JWT ${string}`;
};

export const defaultHeaders: AppHeaders = null;

export const kitQLClient = new KitQLClient({
	url: 'https://api.wemarket.click/graphql/', //'https://demo.saleor.io/graphql/', 
	headersContentType: 'application/json',
	headers: defaultHeaders,
	credentials: 'include',
	logType: ['client', 'server', 'operationAndvariables']
});