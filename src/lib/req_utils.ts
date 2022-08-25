import { browser } from '$app/env';

export function browserGet(key: any) {
    if(browser) {
        const item = localStorage.getItem(key);
        if(item) {
            return JSON.parse(item)
        }
    }
    return null
};

export function browserSet(key: any, value: any) {
    if(browser) {
        localStorage.setItem(key, value)
    }
};