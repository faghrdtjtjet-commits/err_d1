<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { language, translations } from '$lib/i18n';

	let videos: any[] = [];
	let user: any = null;
	let sidebarOpen = true;
	let loading = true;

	let searchQuery = '';

	$: lang = $language;
	$: t = translations[lang];

	onMount(async () => {
		searchQuery = $page.url.searchParams.get('q') || '';
		await loadData();
	});

	$: if (searchQuery && typeof window !== 'undefined') {
		loadData();
	}

	async function loadData() {
		if (!searchQuery) return;
		loading = true;

		try {
			const userRes = await fetch('/api/auth/me');
			if (userRes.ok) {
				const userData = await userRes.json();
				user = userData.user;
			}
		} catch (e) {}

		if (searchQuery) {
			const res = await fetch(`/api/videos?search=${encodeURIComponent(searchQuery)}`);
			if (res.ok) {
				const data = await res.json();
				videos = data.videos;
			}
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Search: {searchQuery} - VibeTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="container">
			<h1>{t.searchResultsFor} "{searchQuery}"</h1>

			{#if loading}
				<div class="loading">{t.searching}</div>
			{:else if videos.length === 0}
				<div class="empty">{t.noVideosFound}</div>
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
		min-height: 300px;
		color: var(--text-secondary);
		font-size: 18px;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}
</style>
