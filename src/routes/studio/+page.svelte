<script lang="ts">
	import { onMount } from 'svelte';
	import { BarChart3, Video, MessageSquare, ThumbsUp, Eye, TrendingUp } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let stats: any = null;
	let recentVideos: any[] = [];
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

		const statsRes = await fetch('/api/studio/stats');
		if (statsRes.ok) {
			const data = await statsRes.json();
			stats = data;
		}

		const videosRes = await fetch(`/api/videos?userId=${user.id}&limit=5`);
		if (videosRes.ok) {
			const data = await videosRes.json();
			recentVideos = data.videos;
		}

		loading = false;
	});
</script>

<svelte:head>
	<title>Creator Studio - VibeTube</title>
</svelte:head>

<div class="studio">
	<Header {user} onMenuClick={() => {}} />
	
	<div class="studio-layout">
		<aside class="studio-sidebar">
			<nav>
				<a href="/studio" class="active">
					<BarChart3 size={20} />
					<span>{t.dashboard}</span>
				</a>
				<a href="/studio/videos">
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
				<h1>{t.dashboard}</h1>
				<p>{lang === 'ru' ? `Добро пожаловать, ${user?.username || 'Создатель'}!` : `Welcome back, ${user?.username || 'Creator'}!`}</p>
			</div>

			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else if stats}
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-icon views">
							<Eye size={24} />
						</div>
						<div class="stat-content">
							<span class="stat-label">{t.totalViews}</span>
							<span class="stat-value">{stats.totalViews?.toLocaleString() || 0}</span>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon videos">
							<Video size={24} />
						</div>
						<div class="stat-content">
							<span class="stat-label">{t.videos}</span>
							<span class="stat-value">{stats.totalVideos || 0}</span>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon likes">
							<ThumbsUp size={24} />
						</div>
						<div class="stat-content">
							<span class="stat-label">{t.totalLikes}</span>
							<span class="stat-value">{stats.totalLikes || 0}</span>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon comments">
							<MessageSquare size={24} />
						</div>
						<div class="stat-content">
							<span class="stat-label">{t.comments}</span>
							<span class="stat-value">{stats.totalComments || 0}</span>
						</div>
					</div>
				</div>

				<div class="recent-section">
					<div class="section-header">
						<h2>{t.latestVideos}</h2>
						<a href="/studio/videos" class="btn-secondary">{lang === 'ru' ? 'Показать все' : 'View All'}</a>
					</div>

					{#if recentVideos.length === 0}
						<div class="empty-state">
							<Video size={48} />
							<p>{t.noVideos}</p>
							<a href="/upload" class="btn-primary">{t.uploadFirst}</a>
						</div>
					{:else}
						<div class="videos-table">
							<table>
								<thead>
									<tr>
										<th>{t.video}</th>
										<th>{t.views}</th>
										<th>{t.likes}</th>
										<th>{t.comments}</th>
										<th>{lang === 'ru' ? 'Дата' : 'Date'}</th>
									</tr>
								</thead>
								<tbody>
									{#each recentVideos as video}
										<tr>
											<td class="video-cell">
												<a href="/watch/{video.id}">
													{#if video.thumbnail_url}
														<img src={video.thumbnail_url} alt={video.title} />
													{:else}
														<div class="no-thumb">
															<Video size={20} />
														</div>
													{/if}
													<span>{video.title}</span>
												</a>
											</td>
											<td>{video.views?.toLocaleString() || 0}</td>
											<td>{video.likes || 0}</td>
											<td>
												{#await fetch(`/api/comments?videoId=${video.id}`).then(r => r.json()).then(d => d.comments?.length || 0)}
													...
												{:then count}
													{count}
												{:catch}
													0
												{/await}
											</td>
											<td>{new Date(video.created_at).toLocaleDateString()}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.studio {
		min-height: 100vh;
		background: var(--bg-primary);
	}

	.studio-layout {
		display: flex;
		margin-top: 56px;
	}

	.studio-sidebar {
		width: 240px;
		background: var(--bg-secondary);
		border-right: 1px solid var(--border);
		padding: 16px 0;
		position: fixed;
		left: 0;
		top: 56px;
		bottom: 0;
		overflow-y: auto;
	}

	.studio-sidebar nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.studio-sidebar a {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 24px;
		color: var(--text-primary);
		text-decoration: none;
		transition: background 0.2s;
	}

	.studio-sidebar a:hover {
		background: var(--bg-hover);
	}

	.studio-sidebar a.active {
		background: var(--accent);
		color: white;
	}

	.studio-main {
		flex: 1;
		margin-left: 240px;
		padding: 32px;
		max-width: 1400px;
	}

	.studio-header {
		margin-bottom: 32px;
	}

	.studio-header h1 {
		font-size: 32px;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.studio-header p {
		color: var(--text-secondary);
		font-size: 16px;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--text-secondary);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
	}

	.stat-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 24px;
		display: flex;
		gap: 20px;
	}

	.stat-icon {
		width: 56px;
		height: 56px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.stat-icon.views { background: linear-gradient(135deg, #667eea, #764ba2); }
	.stat-icon.videos { background: linear-gradient(135deg, var(--accent), var(--accent-hover)); }
	.stat-icon.likes { background: linear-gradient(135deg, #f093fb, #f5576c); }
	.stat-icon.comments { background: linear-gradient(135deg, #4facfe, #00f2fe); }

	.stat-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.stat-label {
		font-size: 14px;
		color: var(--text-secondary);
		margin-bottom: 4px;
	}

	.stat-value {
		font-size: 28px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.recent-section {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 24px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.section-header h2 {
		font-size: 20px;
		font-weight: 500;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		color: var(--text-secondary);
		gap: 16px;
	}

	.videos-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 12px;
		color: var(--text-secondary);
		font-size: 13px;
		font-weight: 500;
		border-bottom: 1px solid var(--border);
	}

	td {
		padding: 16px 12px;
		border-bottom: 1px solid var(--border);
	}

	.video-cell a {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text-primary);
		text-decoration: none;
	}

	.video-cell img,
	.video-cell .no-thumb {
		width: 120px;
		height: 68px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.no-thumb {
		background: var(--bg-hover);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
	}

	.video-cell span {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	@media (max-width: 1024px) {
		.studio-sidebar {
			transform: translateX(-240px);
		}

		.studio-main {
			margin-left: 0;
		}

		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.studio-main {
			padding: 20px 16px;
		}

		.studio-header h1 {
			font-size: 22px;
		}

		.studio-header p {
			font-size: 14px;
		}

		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
			gap: 12px;
		}

		.stat-card {
			padding: 16px;
		}

		.stat-card h3 {
			font-size: 11px;
		}

		.stat-card .value {
			font-size: 22px;
		}

		.content h2 {
			font-size: 18px;
		}

		.video-cell img,
		.video-cell .no-thumb {
			width: 80px;
			height: 45px;
		}

		table {
			font-size: 14px;
			min-width: 600px;
		}

		th, td {
			padding: 10px 8px;
			font-size: 13px;
		}

		.table-wrapper {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}
	}

	@media (max-width: 480px) {
		.studio-main {
			padding: 16px 12px;
		}

		.studio-header h1 {
			font-size: 20px;
			margin-bottom: 6px;
		}

		.studio-header p {
			font-size: 13px;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 10px;
		}

		.stat-card {
			padding: 14px 12px;
		}

		.content h2 {
			font-size: 16px;
			margin-bottom: 12px;
		}

		th, td {
			padding: 8px 6px;
			font-size: 12px;
		}

		.video-cell {
			min-width: 180px;
		}

		.video-cell img,
		.video-cell .no-thumb {
			width: 70px;
			height: 39px;
		}

		.video-cell h3 {
			font-size: 12px;
		}
	}
</style>
