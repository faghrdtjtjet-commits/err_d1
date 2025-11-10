<script lang="ts">
	import { onMount } from 'svelte';
	import { TrendingUp, BarChart3, Video, MessageSquare } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let stats: any = null;

	$: lang = $language;
	$: t = translations[lang];

	onMount(async () => {
		const userRes = await fetch('/api/auth/me');
		if (!userRes.ok) {
			window.location.href = '/login';
			return;
		}
		user = (await userRes.json()).user;

		const statsRes = await fetch('/api/studio/stats');
		if (statsRes.ok) stats = (await statsRes.json());
	});
</script>

<svelte:head><title>Analytics - Creator Studio</title></svelte:head>

<div class="studio">
	<Header {user} onMenuClick={() => {}} />
	<div class="studio-layout">
		<aside class="studio-sidebar">
			<nav>
				<a href="/studio">
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
				<a href="/studio/analytics" class="active">
					<TrendingUp size={20} />
					<span>{t.analytics}</span>
				</a>
			</nav>
		</aside>
		<main class="studio-main">
			<h1>{t.analytics}</h1>
			{#if stats}
				<div class="stats-grid">
					<div class="stat-card">
						<h3>{t.totalViews}</h3>
						<p class="stat-value">{stats.totalViews?.toLocaleString() || 0}</p>
					</div>
					<div class="stat-card">
						<h3>{t.videos}</h3>
						<p class="stat-value">{stats.totalVideos || 0}</p>
					</div>
					<div class="stat-card">
						<h3>{t.likes}</h3>
						<p class="stat-value">{stats.totalLikes || 0}</p>
					</div>
					<div class="stat-card">
						<h3>{t.comments}</h3>
						<p class="stat-value">{stats.totalComments || 0}</p>
					</div>
					<div class="stat-card">
						<h3>{t.subscribers}</h3>
						<p class="stat-value">{stats.subscribers || 0}</p>
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.studio { min-height: 100vh; background: var(--bg-primary); }
	.studio-layout { display: flex; margin-top: 56px; }
	.studio-sidebar { width: 240px; background: var(--bg-secondary); border-right: 1px solid var(--border); padding: 16px 0; position: fixed; left: 0; top: 56px; bottom: 0; }
	.studio-sidebar nav { display: flex; flex-direction: column; gap: 4px; }
	.studio-sidebar a { display: flex; align-items: center; gap: 16px; padding: 12px 24px; color: var(--text-primary); text-decoration: none; }
	.studio-sidebar a:hover { background: var(--bg-hover); }
	.studio-sidebar a.active { background: var(--accent); color: white; }
	.studio-main { flex: 1; margin-left: 240px; padding: 32px; }
	h1 { font-size: 32px; margin-bottom: 32px; }
	.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
	.stat-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
	.stat-card h3 { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }
	.stat-value { font-size: 32px; font-weight: 600; color: var(--accent); }
	@media (max-width: 1024px) { .studio-sidebar { transform: translateX(-240px); } .studio-main { margin-left: 0; } }
</style>
