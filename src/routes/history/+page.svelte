<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { language, translations } from '$lib/i18n';

	let videos: any[] = [];
	let user: any = null;
	let sidebarOpen = true;
	let loading = true;

	$: lang = $language;
	$: t = translations[lang];

	onMount(async () => {
		const userRes = await fetch('/api/auth/me');
		if (!userRes.ok) {
			window.location.href = '/login';
			return;
		}
		const userData = await userRes.json();
		user = userData.user;

		const res = await fetch('/api/watch-history');
		if (res.ok) {
			const data = await res.json();
			// Remove duplicates based on video_id to fix the duplicate key error
			const seen = new Set();
			videos = data.videos.filter((video: any) => {
				if (seen.has(video.id)) {
					return false;
				}
				seen.add(video.id);
				return true;
			});
		}

		loading = false;
	});
</script>

<svelte:head>
	<title>Watch History - VibeTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="container">
			<h1>{t.history}</h1>
			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else if videos.length === 0}
				<div class="empty">{t.noWatchHistory}</div>
			{:else}
				<VideoGrid {videos} />
			{/if}
		</div>
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		margin-top: 56px;
		margin-left: 0;
		min-height: calc(100vh - 56px);
		transition: margin-left 0.3s;
	}

	main.sidebar-open {
		margin-left: 240px;
	}

	h1 {
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 24px;
		padding-top: 24px;
	}

	.loading,
	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--text-secondary);
		font-size: 18px;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}
</style>
