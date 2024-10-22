import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
  const { user } = await parent();
  const newReleases = fetch('/api/spotify/browse/new-releases?limit=6');
  const featuredPlaylists = fetch('/api/spotify/browse/featured-playlists');
  const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists`);

  const catsRes = await fetch('/api/spotify/browse/categories?limit=10');
  const catsResJSON: SpotifyApi.MultipleCategoriesResponse | undefined = catsRes.ok ? await catsRes.json() : undefined;
  const randomCats = catsResJSON ? catsResJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3) : [];

  const randomCatsPromises = randomCats.map(cat => fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`));

  const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCatsRes] = await Promise.all([newReleases, featuredPlaylists, userPlaylists, ...randomCatsPromises]);

  console.log("Random Cats Res", randomCatsRes);
  return {
    newReleases: newReleasesRes.ok ? await newReleasesRes.json() as SpotifyApi.ListOfNewReleasesResponse : undefined,
    featuredPlaylists: featuredPlaylistsRes.ok ? await featuredPlaylistsRes.json() as SpotifyApi.ListOfFeaturedPlaylistsResponse : undefined,
    userPlaylists: userPlaylistsRes.ok ? await userPlaylistsRes.json() as SpotifyApi.ListOfUsersPlaylistsResponse : undefined,
    homeCategories: randomCats,
    categoriesPlaylists: await Promise.all(randomCatsRes.map(res => res.ok ? res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse> : undefined)),
  };
};