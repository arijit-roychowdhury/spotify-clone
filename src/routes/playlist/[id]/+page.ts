import fetchRefresh from '$lib/helpers/fetch-refresh';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, depends, route, url }) => {
	depends(`app:${route.id}`);
  const playlistRes = await fetchRefresh(fetch, `/api/spotify/playlists/${params.id}`);
  let color = null;
	const limit = 100;
	const page = url.searchParams.get('page');

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'Failed to load playlist!');
	}

	const playlistResJSON: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

	if (page && page !== '1') {
		const tracksRes = await fetch(
			`/api/spotify/playlists/${params.id}/tracks?${new URLSearchParams({
				limit: `${limit}`,
				offset: `${limit * (Number(page) - 1)}`
			}).toString()}`
		);
		if (!tracksRes.ok) {
			throw error(tracksRes.status, 'Failed to load playlist!');
		}
		const tracksResJSON = await tracksRes.json();
		playlistResJSON.tracks = tracksResJSON;
	}

	if (playlistResJSON.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({
				image: playlistResJSON.images[0].url
			}).toString()}`
		);
		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		playlist: playlistResJSON,
		title: playlistResJSON.name,
		color
	};
};