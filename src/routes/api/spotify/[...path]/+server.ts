import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_BASE_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, cookies, params, url }) => {
  const accessToken = cookies.get('access_token');
  if (!accessToken) {
    return json({ error: 'No access token found' }, { status: 401 });
  }

  try {
    const response = await fetch(`${SPOTIFY_BASE_URL}/${params.path}${url.search}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    const responseJSON = await response.json();
    if (responseJSON.error) {
      throw error(responseJSON.error.status || 500, responseJSON.error.message || 'Spotify API error');
    }
    return json(responseJSON);
  } catch (err: any) {
    // If it's already a SvelteKit error, re-throw it
    if (err.status) {
      throw err;
    }
    // Otherwise, create a new error with proper status
    throw error(500, `An error occurred while fetching data: ${err.message || err}`);
  }
};