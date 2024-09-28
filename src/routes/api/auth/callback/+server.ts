import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { BASE_URL, SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';


export const GET: RequestHandler = async ({cookies, url, fetch}) => {
  const code: string | null = url.searchParams.get('code') || null;
  const state: string | null = url.searchParams.get('state') || null;

  const storedState: string | null = cookies.get('spotify_auth_state') || null;
  const storedCodeVerifier: string | null = cookies.get('spotify_auth_code_verifier') || null;

  if (state === null || state !== storedState) {
    throw error(400, 'State Mismatch');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_APP_CLIENT_ID,
      grant_type: 'authorization_code',
      code: code || '',
      redirect_uri: `${BASE_URL}/api/auth/callback`,
      code_verifier: storedCodeVerifier || '',
    }),
  });
  const responseJSON = await response.json();
  if (responseJSON.error) {
    throw error(400, responseJSON.error_description)
  }

  cookies.delete('spotify_auth_state', {path: '/'});
  cookies.delete('spotify_auth_code_verifier', {path: '/'});
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

  throw redirect(303, '/');
}