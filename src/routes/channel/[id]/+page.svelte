<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { formatViews } from '$lib/utils';
	import { language, translations } from '$lib/i18n';

	let channel: any = null;
	let videos: any[] = [];
	let user: any = null;
	let sidebarOpen = true;
	let isSubscribed = false;
	let loading = true;

	$: lang = $language;
	$: t = translations[lang];

	$: channelId = $page.params.id;

	onMount(async () => {
		await loadChannel();
	});

	async function loadChannel() {
		loading = true;

		try {
			const userRes = await fetch('/api/auth/me');
			if (userRes.ok) {
				const userData = await userRes.json();
				user = userData.user;
			}
		} catch (e) {}

		// Load channel info directly from user API
		const userDetailsRes = await fetch(`/api/users/${channelId}`);
		if (userDetailsRes.ok) {
			const data = await userDetailsRes.json();
			const userDetails = data.user;
			
			if (userDetails) {
				channel = {
					id: userDetails.id,
					username: userDetails.username,
					avatar: userDetails.avatar,
					banner: userDetails.banner,
					description: userDetails.description || '',
					subscribers: 0
				};
			}
		}

		// Load videos for the channel
		const videosRes = await fetch(`/api/videos?userId=${channelId}`);
		if (videosRes.ok) {
			const data = await videosRes.json();
			videos = data.videos || [];
		}

		if (user && channel) {
			const subRes = await fetch(`/api/subscriptions?channelId=${channelId}`);
			if (subRes.ok) {
				const subData = await subRes.json();
				isSubscribed = subData.subscribed;
			}
		}

		loading = false;
	}

	async function handleSubscribe() {
		if (!user) {
			window.location.href = '/login';
			return;
		}

		const res = await fetch('/api/subscriptions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ channelId })
		});

		if (res.ok) {
			const data = await res.json();
			isSubscribed = data.subscribed;
		}
	}
</script>

<svelte:head>
	<title>{channel?.username || 'Channel'} - VibeTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		{#if loading}
			<div class="loading">{t.loading}</div>
		{:else if channel}
			<div class="channel-header">
				<div class="banner" style={channel.banner ? `background-image: url(${channel.banner})` : ''}></div>
				<div class="channel-info">
					<img src={channel.avatar} alt={channel.username} class="avatar" />
					<div class="info">
						<h1>{channel.username}</h1>
						<p class="stats">{formatViews(channel.subscribers)} {t.subscribers_other} • {videos.length} {t.videos_other}</p>
						{#if channel.description}
							<p class="description">{channel.description}</p>
						{/if}
					</div>
					{#if user && channelId}
						{#if user.id === parseInt(channelId)}
							<div class="my-channel-badge">
								<span>{t.myChannel}</span>
								<a href="/settings" class="btn-secondary">{t.settings}</a>
								<a href="/studio" class="btn-primary">{t.studio}</a>
							</div>
						{:else}
							<button class="btn-primary" class:subscribed={isSubscribed} on:click={handleSubscribe}>
								{isSubscribed ? t.subscribed : t.subscribe}
							</button>
						{/if}
					{/if}
				</div>
			</div>

			<div class="container">
				<h2>{t.videos}</h2>
				{#if videos.length === 0}
					<div class="empty">{t.noVideos}</div>
				{:else}
					<VideoGrid {videos} />
				{/if}
			</div>
		{:else}
			<div class="error">{t.channelNotFound}</div>
		{/if}
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		margin-top: 56px;
		margin-left: 0;
		transition: margin-left 0.3s;
	}

	main.sidebar-open {
		margin-left: 240px;
	}

	.channel-header {
		margin-bottom: 32px;
	}

	.banner {
		height: 200px;
		background: linear-gradient(135deg, var(--accent), #1e5a8e);
		background-size: cover;
		background-position: center;
	}

	.channel-info {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 24px;
		border-bottom: 1px solid var(--border);
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-top: -40px;
		border: 4px solid var(--bg-primary);
	}

	.info {
		flex: 1;
	}

	h1 {
		font-size: 32px;
		font-weight: 600;
		margin-bottom: 4px;
	}

	.info p.stats {
		color: var(--text-secondary);
		font-size: 14px;
		margin-bottom: 8px;
	}

	.info p.description {
		color: var(--text-primary);
		font-size: 14px;
		line-height: 1.5;
		margin-top: 12px;
	}

	.subscribed {
		background: var(--bg-secondary) !important;
	}

	.my-channel-badge {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.my-channel-badge span {
		color: var(--text-secondary);
		font-size: 14px;
		padding: 8px 16px;
		background: var(--bg-secondary);
		border-radius: 20px;
	}

	h2 {
		font-size: 22px;
		font-weight: 500;
		margin-bottom: 16px;
	}

	.loading,
	.empty,
	.error {
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

		.channel-info {
			flex-wrap: wrap;
		}
	}
</style>
