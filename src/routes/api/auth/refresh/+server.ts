import type { RequestHandler } from "./$types";
import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from "$env/static/private";
import { error, json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({cookies, fetch}) => {
  const refreshToken = cookies.get('refresh_token');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_APP_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken || '',
    }),
  });

  const responseJSON = await response.json();
  console.log('Refreshing Token: ',responseJSON);
  if (responseJSON.error) {
    cookies.delete('access_token', {path: '/'});
    cookies.delete('refresh_token', {path: '/'});
    throw error(401, responseJSON.error_description);
  }

  cookies.set('access_token', responseJSON?.access_token, {
    path: '/',
    httpOnly: true,
    secure: true
  });
  cookies.set('refresh_token', responseJSON?.refresh_token, {
    path: '/',
    httpOnly: true,
    secure: true
  });

  return json(responseJSON);
}