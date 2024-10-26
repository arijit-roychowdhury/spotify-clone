import fetchRefresh from '$lib/helpers/fetch-refresh';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const albumRes = await fetchRefresh(fetch, `/api/spotify/albums/${params.id}`);
  if (!albumRes.ok) {
    throw error(albumRes.status, 'Failed to load album!');
  }

  const album: SpotifyApi.SingleAlbumResponse = await albumRes.json();
  
  return {
    album,
    title: album.name,
  };  
};