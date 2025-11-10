<script lang="ts">
	import { Home, TrendingUp, History, Clock, ThumbsUp, PlaySquare } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { language, translations } from '$lib/i18n';

	export let isOpen = true;
	export let user: any = null;

	let currentLang: 'en' | 'ru' = 'en';

	language.subscribe(lang => {
		currentLang = lang;
	});

	$: t = translations[currentLang];
	$: currentPath = $page.url.pathname;
</script>

<aside class:closed={!isOpen}>
	<nav>
		<a href="/" class:active={currentPath === '/'}>
			<Home size={20} />
			<span>{t.home}</span>
		</a>
		<a href="/trending">
			<TrendingUp size={20} />
			<span>{t.trending}</span>
		</a>
		{#if user}
			<hr />
			<a href="/history">
				<History size={20} />
				<span>{t.history}</span>
			</a>
			<a href="/watch-later">
				<Clock size={20} />
				<span>{t.watchLater}</span>
			</a>
			<a href="/liked">
				<ThumbsUp size={20} />
				<span>{t.liked}</span>
			</a>
			<a href="/my-videos">
				<PlaySquare size={20} />
				<span>{t.myVideos}</span>
			</a>
		{/if}
	</nav>
</aside>

<style>
	aside {
		position: fixed;
		left: 0;
		top: 56px;
		bottom: 0;
		width: 240px;
		background: var(--bg-primary);
		border-right: 1px solid var(--border);
		padding: 12px 0;
		overflow-y: auto;
		transition: transform 0.3s;
		z-index: 900;
	}

	aside.closed {
		transform: translateX(-240px);
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	nav a {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 10px 24px;
		color: var(--text-primary);
		text-decoration: none;
		transition: background 0.2s;
	}

	nav a:hover {
		background: var(--bg-hover);
	}

	nav a.active {
		background: var(--bg-secondary);
		font-weight: 500;
	}

	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 12px 0;
	}

	@media (max-width: 1024px) {
		aside {
			position: fixed;
			transform: translateX(-240px);
			background: var(--bg-primary);
			box-shadow: 2px 0 8px rgba(0, 0, 0, 0.5);
		}

		aside:not(.closed) {
			transform: translateX(0);
		}
	}

	@media (max-width: 768px) {
		aside {
			width: 100%;
			max-width: 280px;
		}
	}
</style>
