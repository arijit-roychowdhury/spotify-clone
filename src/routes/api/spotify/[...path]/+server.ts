import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_BASE_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

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
      throw new Error(responseJSON.error.status, responseJSON.error.message);
    }
    return json(responseJSON);
  } catch (error) {
    return json({ error: `An error occurred while fetching data: ${error}` }, { status: 500 });
  }
};