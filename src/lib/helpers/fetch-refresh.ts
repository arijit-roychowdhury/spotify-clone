import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export default async function fetchRefresh(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	path: string
) {
	const req = fetch(path);
	if (!browser) return req;
	const res = await req;
	if (!res.ok) {
    if (!globalThis.refreshPromise) {
      globalThis.refreshPromise = fetch('/api/auth/refresh')
      .finally(() => {
        delete globalThis.refreshPromise;
      });
    }
	  const refreshRes = await globalThis.refreshPromise;
		if (!refreshRes.ok) throw error(401, 'Session Expired!');
		return fetch(path);
	} else {
		return res;
	}
}