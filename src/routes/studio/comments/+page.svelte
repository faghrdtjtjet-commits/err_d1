<script lang="ts">
	import { onMount } from 'svelte';
	import { MessageSquare, Trash2, BarChart3, Video, TrendingUp } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let comments: any[] = [];
	let loading = true;

	$: lang = $language;
	$: t = translations[lang];

	onMount(async () => {
		const userRes = await fetch('/api/auth/me');
		if (!userRes.ok) {
			window.location.href = '/login';
			return;
		}
		user = (await userRes.json()).user;

		const res = await fetch(`/api/studio/comments`);
		if (res.ok) {
			comments = (await res.json()).comments;
		}
		loading = false;
	});

	async function handleDelete(commentId: number) {
		const confirmMsg = lang === 'ru' ? 'Удалить этот комментарий?' : 'Delete this comment?';
		if (!confirm(confirmMsg)) return;
		const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
		if (res.ok) comments = comments.filter(c => c.id !== commentId);
	}
</script>

<svelte:head><title>Comments - Creator Studio</title></svelte:head>

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
				<a href="/studio/comments" class="active">
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
			<h1>{t.comments}</h1>
			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else if comments.length === 0}
				<div class="empty">{t.noCommentsYet}</div>
			{:else}
				<div class="comments-list">
					{#each comments as comment}
						<div class="comment-item">
							<div class="comment-content">
								<strong>{comment.username}</strong>
								<p>{comment.content}</p>
								<span class="meta">{t.on}: {comment.video_title}</span>
							</div>
							<button class="btn-icon danger" on:click={() => handleDelete(comment.id)}>
								<Trash2 size={18} />
							</button>
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
	.studio-sidebar { width: 240px; background: var(--bg-secondary); border-right: 1px solid var(--border); padding: 16px 0; position: fixed; left: 0; top: 56px; bottom: 0; }
	.studio-sidebar nav { display: flex; flex-direction: column; gap: 4px; }
	.studio-sidebar a { display: flex; align-items: center; gap: 16px; padding: 12px 24px; color: var(--text-primary); text-decoration: none; }
	.studio-sidebar a:hover { background: var(--bg-hover); }
	.studio-sidebar a.active { background: var(--accent); color: white; }
	.studio-main { flex: 1; margin-left: 240px; padding: 32px; }
	h1 { font-size: 32px; margin-bottom: 24px; }
	.loading, .empty { min-height: 300px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
	.comments-list { display: flex; flex-direction: column; gap: 12px; }
	.comment-item { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: start; }
	.comment-content { flex: 1; }
	.comment-content strong { display: block; margin-bottom: 8px; }
	.comment-content p { margin-bottom: 8px; }
	.meta { font-size: 12px; color: var(--text-secondary); }
	.btn-icon { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-hover); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-primary); }
	.btn-icon.danger:hover { background: #e74c3c; color: white; }
	@media (max-width: 1024px) { .studio-sidebar { transform: translateX(-240px); } .studio-main { margin-left: 0; } }
</style>
