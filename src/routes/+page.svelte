<script lang="ts">
	import type { PageData } from '$lib/types';

	export let data: PageData;
	let sections: {
		title: string;
		path: string;
		items: (SpotifyApi.AlbumObjectSimplified | SpotifyApi.PlaylistObjectSimplified)[];
	}[] = [];

	$: {
		if (data.newReleases) {
			sections.push({
				title: 'New Releases',
				path: '/sections/new-releases',
				items: data.newReleases.albums.items
			});
		}

		if (data.featuredPlaylists) {
			sections.push({
				title: 'Featured Playlists',
				path: '/sections/featured-playlists',
				items: data.featuredPlaylists.playlists.items
			});
		}

		data.homeCategories.forEach((category, index) => {
			const categoryPlaylist = data.categoriesPlaylists[index];
			if (categoryPlaylist) {
				sections.push({
					title: category.name,
					path: `/sections/${category.id}`,
					items: categoryPlaylist.playlists.items
				});
			}
		});

		if (data.userPlaylists) {
			sections.push({
				title: 'Your Playlists',
				path: '/sections/user-playlists',
				items: data.userPlaylists.items
			});
		}
	}
	$: console.log('Sections', sections);
</script>

{#each sections as section}
	<section>
		<h2>{section.title}</h2>
		<ul>
			{#each section.items as item}
				<li>
					<a href={item.external_urls.spotify}>
						<img src={item.images[0].url} alt={item.name} />
						<p>{item.name}</p>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/each}

<style lang="scss">
	section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 2rem;
		color: #1db954;
		margin-bottom: 1rem;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		padding: 0;
	}

	li {
		background-color: #282828;
		border-radius: 8px;
		overflow: hidden;
		width: 150px;
		text-align: center;
		transition: transform 0.2s;
		&:hover {
			transform: scale(1.05);
		}
	}

	a {
		color: inherit;
		text-decoration: none;
		display: block;
		padding: 1rem;
	}

	img {
		width: 100%;
		height: auto;
		border-bottom: 1px solid #1db954;
	}

	p {
		margin: 0.5rem 0 0;
		font-size: 1rem;
	}
</style>
