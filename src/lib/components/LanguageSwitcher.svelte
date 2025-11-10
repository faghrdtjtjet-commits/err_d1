<script lang="ts">
	import { language } from '$lib/i18n';
	import { Globe } from 'lucide-svelte';

	let currentLang: 'en' | 'ru' = 'en';
	let showMenu = false;

	language.subscribe(lang => {
		currentLang = lang;
	});

	function setLanguage(lang: 'en' | 'ru') {
		language.set(lang);
		showMenu = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			showMenu = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-switcher">
	<button class="lang-btn" on:click|stopPropagation={() => showMenu = !showMenu}>
		<Globe size={20} />
		<span class="lang-code">{currentLang.toUpperCase()}</span>
	</button>

	{#if showMenu}
		<div class="lang-menu">
			<button
				class="lang-option"
				class:active={currentLang === 'en'}
				on:click={() => setLanguage('en')}
			>
				<span class="flag">🇺🇸</span>
				<span>English</span>
			</button>
			<button
				class="lang-option"
				class:active={currentLang === 'ru'}
				on:click={() => setLanguage('ru')}
			>
				<span class="flag">🇷🇺</span>
				<span>Русский</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		position: relative;
	}

	.lang-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: none;
		border: none;
		border-radius: 8px;
		color: var(--text-primary);
		cursor: pointer;
		transition: background 0.2s;
	}

	.lang-btn:hover {
		background: var(--bg-hover);
	}

	.lang-code {
		font-size: 14px;
		font-weight: 500;
	}

	.lang-menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 8px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 8px;
		min-width: 180px;
		z-index: 1000;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.lang-option {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 10px 12px;
		background: none;
		border: none;
		border-radius: 6px;
		color: var(--text-primary);
		cursor: pointer;
		font-size: 14px;
		text-align: left;
		transition: background 0.2s;
	}

	.lang-option:hover {
		background: var(--bg-hover);
	}

	.lang-option.active {
		background: rgba(155, 89, 182, 0.2);
		color: var(--accent);
	}

	.flag {
		font-size: 20px;
	}

	@media (max-width: 768px) {
		.lang-code {
			display: none;
		}

		.lang-menu {
			right: auto;
			left: 0;
		}
	}
</style>
