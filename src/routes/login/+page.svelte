<script lang="ts">
	import { Video } from 'lucide-svelte';
	import { language, translations } from '$lib/i18n';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	$: lang = $language;
	$: t = translations[lang];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.ok) {
			window.location.href = '/';
		} else {
			error = data.error || (lang === 'ru' ? 'Ошибка входа' : 'Login failed');
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Sign In - VibeTube</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="logo">
			<Video size={48} />
			<h1>VibeTube</h1>
		</div>

		<h2>{t.signIn}</h2>

		<form on:submit={handleSubmit}>
			{#if error}
				<div class="error">{error}</div>
			{/if}

			<div class="form-group">
				<label for="email">{t.email}</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder={lang === 'ru' ? 'Введите ваш email' : 'Enter your email'}
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="password">{t.password}</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					placeholder={lang === 'ru' ? 'Введите ваш пароль' : 'Enter your password'}
					disabled={loading}
				/>
			</div>

			<button type="submit" class="btn-primary" disabled={loading}>
				{loading ? (lang === 'ru' ? 'Вход...' : 'Signing in...') : t.signIn}
			</button>
		</form>

		<p class="switch">
			{t.dontHaveAccount} <a href="/register">{t.signUp}</a>
		</p>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}

	.auth-card {
		background: var(--bg-secondary);
		padding: 48px;
		border-radius: 16px;
		width: 100%;
		max-width: 440px;
		border: 1px solid var(--border);
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		margin-bottom: 32px;
	}

	.logo h1 {
		font-size: 28px;
		font-weight: 700;
	}

	h2 {
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 24px;
		text-align: center;
	}

	.error {
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 15px;
	}

	button[type='submit'] {
		width: 100%;
		padding: 14px;
		font-size: 16px;
		font-weight: 500;
		margin-top: 8px;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.switch {
		text-align: center;
		margin-top: 24px;
		color: var(--text-secondary);
		font-size: 14px;
	}

	.switch a {
		color: var(--accent);
		text-decoration: none;
	}

	.switch a:hover {
		text-decoration: underline;
	}
</style>
