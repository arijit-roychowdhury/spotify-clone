import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export async function fetchRefresh(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	path: string
) {
	const req = fetch(path);
	if (!browser) return req;
	const res = await req;
  console.log("Helper Fetch Refresh", res);
	if (!res.ok) {
		const refreshRes = await fetch('/api/auth/refresh');
		if (!refreshRes.ok) throw error(401, 'Session Expired!');
		return fetch(path);
	} else {
		return res;
	}
}