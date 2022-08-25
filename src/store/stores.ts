import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const cart = writable([]);
cart.subscribe((val) => val);

export const cartLength = writable(0);
cartLength.subscribe((val) => val);

export const checkout = writable({});
checkout.subscribe((val) => val);

export const getUserToken = writable("");
getUserToken.subscribe((val) => val);

export const getCheckoutToken = writable(
    browser && (localStorage.getItem("getCheckoutToken") || "")
);
getCheckoutToken.subscribe((val) => browser && localStorage.setItem("getCheckoutToken", val));

