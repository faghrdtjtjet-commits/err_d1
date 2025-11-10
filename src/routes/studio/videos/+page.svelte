<script lang="ts">
	import { onMount } from 'svelte';
	import { Video, Edit, Trash2, Eye, ThumbsUp, MessageSquare, BarChart3, TrendingUp } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let videos: any[] = [];
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

		await loadVideos();
	});

	async function loadVideos() {
		const res = await fetch(`/api/videos?userId=${user.id}`);
		if (res.ok) {
			const data = await res.json();
			videos = data.videos;
		}
		loading = false;
	}

	async function handleDelete(videoId: number) {
		const confirmMsg = lang === 'ru' ? 'Вы уверены, что хотите удалить это видео?' : 'Are you sure you want to delete this video?';
		if (!confirm(confirmMsg)) return;

		const res = await fetch(`/api/videos/${videoId}`, { method: 'DELETE' });
		if (res.ok) {
			videos = videos.filter(v => v.id !== videoId);
		}
	}
</script>

<svelte:head>
	<title>Content - Creator Studio</title>
</svelte:head>

<div class="studio">
	<Header {user} onMenuClick={() => {}} />
	
	<div class="studio-layout">
		<aside class="studio-sidebar">
			<nav>
				<a href="/studio">
					<BarChart3 size={20} />
					<span>{t.dashboard}</span>
				</a>
				<a href="/studio/videos" class="active">
					<Video size={20} />
					<span>{t.content}</span>
				</a>
				<a href="/studio/comments">
					<MessageSquare size={20} />
					<span>{t.comments}</span>
				</a>
				<a href="/studio/analytics">
					<TrendingUp size={20} />
					<span>{t.analytics}</span>
				</a>
			</nav>
		</aside>

		<main class="studio-main">
			<div class="studio-header">
				<h1>{t.content}</h1>
				<a href="/upload" class="btn-primary">{t.uploadVideo}</a>
			</div>

			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else if videos.length === 0}
				<div class="empty-state">
					<Video size={64} />
					<h2>{t.noVideos}</h2>
					<p>{lang === 'ru' ? 'Начните с загрузки первого видео' : 'Start by uploading your first video'}</p>
					<a href="/upload" class="btn-primary">{t.uploadVideo}</a>
				</div>
			{:else}
				<div class="videos-list">
					{#each videos as video}
						<div class="video-item">
							<div class="video-thumbnail">
								{#if video.thumbnail_url}
									<img src={video.thumbnail_url} alt={video.title} />
								{:else}
									<div class="no-thumb"><Video size={32} /></div>
								{/if}
							</div>
							<div class="video-info">
								<h3>{video.title}</h3>
								<p class="video-desc">{video.description || (lang === 'ru' ? 'Нет описания' : 'No description')}</p>
								<div class="video-stats">
									<span><Eye size={14} /> {video.views} {t.views}</span>
									<span><ThumbsUp size={14} /> {video.likes || 0} {t.likes}</span>
									<span>{new Date(video.created_at).toLocaleDateString()}</span>
								</div>
							</div>
							<div class="video-actions">
								<a href="/studio/edit/{video.id}" class="btn-icon" title={t.edit}>
									<Edit size={18} />
								</a>
								<button class="btn-icon danger" on:click={() => handleDelete(video.id)} title={t.delete}>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.studio { min-height: 100vh; background: var(--bg-primary); }
	.studio-layout { display: flex; margin-top: 56px; }
	
	.studio-sidebar {
		width: 240px;
		background: var(--bg-secondary);
		border-right: 1px solid var(--border);
		padding: 16px 0;
		position: fixed;
		left: 0;
		top: 56px;
		bottom: 0;
	}

	.studio-sidebar nav { display: flex; flex-direction: column; gap: 4px; }
	.studio-sidebar a {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 24px;
		color: var(--text-primary);
		text-decoration: none;
	}
	.studio-sidebar a:hover { background: var(--bg-hover); }
	.studio-sidebar a.active { background: var(--accent); color: white; }

	.studio-main {
		flex: 1;
		margin-left: 240px;
		padding: 32px;
		max-width: 1400px;
	}

	.studio-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	.studio-header h1 { font-size: 32px; font-weight: 600; }

	.loading, .empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		gap: 16px;
		color: var(--text-secondary);
	}

	.videos-list { display: flex; flex-direction: column; gap: 16px; }

	.video-item {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 16px;
		display: flex;
		gap: 16px;
		align-items: center;
	}

	.video-thumbnail {
		width: 168px;
		height: 94px;
		flex-shrink: 0;
		border-radius: 8px;
		overflow: hidden;
	}

	.video-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
	.no-thumb {
		width: 100%;
		height: 100%;
		background: var(--bg-hover);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
	}

	.video-info { flex: 1; min-width: 0; }
	.video-info h3 {
		font-size: 16px;
		font-weight: 500;
		margin-bottom: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.video-desc {
		font-size: 14px;
		color: var(--text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 8px;
	}

	.video-stats {
		display: flex;
		gap: 16px;
		font-size: 13px;
		color: var(--text-secondary);
	}

	.video-stats span {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.video-actions { display: flex; gap: 8px; }
	
	.btn-icon {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: var(--bg-hover);
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.2s;
		color: var(--text-primary);
		text-decoration: none;
	}

	.btn-icon:hover { background: var(--accent); color: white; }
	.btn-icon.danger:hover { background: #e74c3c; }

	@media (max-width: 1024px) {
		.studio-sidebar { transform: translateX(-240px); }
		.studio-main { margin-left: 0; }
	}

	@media (max-width: 768px) {
		.studio-main { padding: 16px; }
		.studio-header { flex-direction: column; gap: 16px; align-items: stretch; }
		.video-item { flex-direction: column; }
		.video-thumbnail { width: 100%; height: auto; aspect-ratio: 16/9; }
		.video-actions { justify-content: flex-end; }
	}
</style>
