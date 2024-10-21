import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/spotify/browse/new-releases');
  const response2 = await fetch('/api/spotify/browse/featured-playlists');
  const data = await response.json();
  const data2 = await response2.json();
  console.log("Data: ", data);
  console.log("Data2: ", data2);

  return {
    props: {
      data
    }
  };
};