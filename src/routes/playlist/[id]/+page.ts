import fetchRefresh from '$lib/helpers/fetch-refresh';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, depends, route }) => {
	depends(`app:${route.id}`);
  const playlistRes = await fetchRefresh(fetch, `/api/spotify/playlists/${params.id}`);
  let color = null;

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'Failed to load playlist!');
	}

	const playlistResJSON: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

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