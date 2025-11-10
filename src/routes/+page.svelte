<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { language, translations } from '$lib/i18n';

	let videos: any[] = [];
	let loading = true;
	let sidebarOpen = true;
	let user: any = null;

	$: lang = $language;
	$: t = translations[lang];

	onMount(async () => {
		try {
			const userRes = await fetch('/api/auth/me');
			if (userRes.ok) {
				const userData = await userRes.json();
				user = userData.user;
			}
		} catch (e) {
			console.log('Not authenticated');
		}

		const res = await fetch('/api/videos');
		if (res.ok) {
			const data = await res.json();
			videos = data.videos;
		}
		loading = false;
	});
</script>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="container">
			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else if videos.length === 0}
				<div class="empty">{lang === 'ru' ? 'Пока нет видео. Будьте первым, кто загрузит!' : 'No videos yet. Be the first to upload!'}</div>
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

	@media (max-width: 768px) {
		main {
			padding: 0;
		}

		.container {
			padding: 16px 12px;
		}

		.loading,
		.empty {
			min-height: 300px;
			font-size: 16px;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 12px 8px;
		}

		.loading,
		.empty {
			font-size: 14px;
			min-height: 250px;
		}
	}
</style>
