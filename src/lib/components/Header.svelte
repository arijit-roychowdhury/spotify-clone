<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Navigation from '$components/Navigation.svelte';
	import LogoutButton from '$components/LogoutButton.svelte';
	import tippy from '$lib/actions/tippy/tippy';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';

	$: user = $page.data.user;
</script>

<div class="content">
	<div class="left">
		{#if browser}
			<Navigation desktop={false} />
		{/if}
	</div>
	<div class="right">
		<div id="profile-button">
			<button
				class="profile-button"
				use:tippy={{
					content: document.getElementById('profile-menu') || undefined,
					onMount: () => {
						const template = document.getElementById('profile-menu');
						if (template) {
							template.style.display = 'block';
						}
					},
					trigger: 'click',
					placement: 'bottom-end',
					interactive: true,
					theme: 'menu'
				}}
			>
				{#if user?.images && user.images.length > 0}
					<img src={user.images[0].url} alt="" />
				{:else}
					<img src="https://picsum.photos/200/300?random=1" alt="" />
				{/if}
				<span class="profile-name">{user?.display_name}</span>
				<span class="visually-hidden">Profile menu</span>
				<ChevronDown class="profile-arrow" size="20" />
			</button>
			<div id="profile-menu" style="display: none">
				<div class="profile-menu-content">
					<ul>
						<li>
							<a href={user?.external_urls.spotify} target="_blank" rel="noopener noreferrer">
								View on Spotify
								<ExternalLink focusable="false" aria-hidden />
							</a>
						</li>
						<li>
							<a href="/profile">View Profile</a>
						</li>
						<li>
							<LogoutButton />
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	.profile-button {
		background: none;
		border: 1px solid var(--border);
		padding: 5px;
		border-radius: 25px;
		display: flex;
		align-items: center;
		color: var(--text-color);
		cursor: pointer;
		.profile-name {
			margin-left: 4px;
		}
		:global(.profile-arrow) {
			margin-left: 3px;
		}
		img {
			width: 28px;
			height: 28px;
			border-radius: 100%;
			margin-right: 6px;
		}
		&:hover {
			background-color: var(--accent-color);
		}
	}
	.profile-menu-content {
		padding: 5px 0;
		ul {
			padding: 0;
			margin: 0;
			list-style: none;
			li {
				&:hover {
					background-image: linear-gradient(rgba(255, 255, 255, 0.07) 0 0);
				}
				a :global(svg) {
					vertical-align: middle;
					margin-left: 10px;
				}
				a,
				:global(button) {
					display: inline-block;
					padding: 10px 15px;
					background: none;
					border: none;
					text-decoration: none;
					cursor: pointer;
					color: var(--menu-text-color);
					width: 100%;
					text-align: left;
					font-size: functions.toRem(14);
				}
			}
		}
	}
</style>
