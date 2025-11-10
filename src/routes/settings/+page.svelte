<script lang="ts">
	import { onMount } from 'svelte';
	import { User, Mail, FileText, Image } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let sidebarOpen = true;
	let loading = true;
	let saving = false;
	let message = '';

	$: lang = $language;
	$: t = translations[lang];

	let username = '';
	let email = '';
	let description = '';
	let avatar = '';
	let banner = '';
	let avatarFile: File | null = null;
	let bannerFile: File | null = null;

	onMount(async () => {
		const res = await fetch('/api/auth/me');
		if (!res.ok) {
			window.location.href = '/login';
			return;
		}
		const data = await res.json();
		user = data.user;
		username = user.username;
		email = user.email;
		description = user.description || '';
		avatar = user.avatar || '';
		banner = user.banner || '';
		loading = false;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		message = '';

		const formData = new FormData();
		formData.append('username', username);
		formData.append('email', email);
		formData.append('description', description);
		
		if (avatarFile) {
			formData.append('avatar', avatarFile);
		}
		if (bannerFile) {
			formData.append('banner', bannerFile);
		}

		const res = await fetch('/api/user/update', {
			method: 'PUT',
			body: formData
		});

		if (res.ok) {
			message = lang === 'ru' ? 'Настройки успешно сохранены!' : 'Settings saved successfully!';
			const data = await res.json();
			user = data.user;
			avatar = user.avatar;
			banner = user.banner;
			avatarFile = null;
			bannerFile = null;
			setTimeout(() => (message = ''), 3000);
		} else {
			const data = await res.json();
			message = data.error || (lang === 'ru' ? 'Не удалось сохранить настройки' : 'Failed to save settings');
		}

		saving = false;
	}

	function handleAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			avatarFile = input.files[0];
		}
	}

	function handleBannerChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			bannerFile = input.files[0];
		}
	}
</script>

<svelte:head>
	<title>Settings - VibeTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="settings-container">
			<h1>{lang === 'ru' ? 'Настройки канала' : 'Channel Settings'}</h1>

			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else}
				<form on:submit={handleSubmit}>
					{#if message}
						<div class="message" class:success={message.includes('success')}>
							{message}
						</div>
					{/if}

					<div class="form-section">
						<h2>{t.profileSettings}</h2>

						<div class="form-group">
							<label for="username">
								<User size={18} />
								{t.username}
							</label>
							<input
								id="username"
								type="text"
								bind:value={username}
								placeholder={lang === 'ru' ? 'Ваше имя пользователя' : 'Your username'}
								required
								disabled={saving}
							/>
						</div>

						<div class="form-group">
							<label for="email">
								<Mail size={18} />
								{t.email}
							</label>
							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder="your@email.com"
								required
								disabled={saving}
							/>
						</div>

						<div class="form-group">
							<label for="description">
								<FileText size={18} />
								{lang === 'ru' ? 'Описание канала' : 'Channel Description'}
							</label>
							<textarea
								id="description"
								bind:value={description}
								placeholder={lang === 'ru' ? 'Расскажите зрителям о вашем канале...' : 'Tell viewers about your channel...'}
								rows="4"
								disabled={saving}
							></textarea>
						</div>
					</div>

					<div class="form-section">
						<h2>{t.channelAppearance}</h2>

						<div class="form-group">
							<label for="avatar">
								<Image size={18} />
								{t.avatarImage}
							</label>
							<input
								id="avatar"
								type="file"
								accept="image/*"
								on:change={handleAvatarChange}
								disabled={saving}
							/>
							{#if avatarFile}
								<div class="preview">
									<img src={URL.createObjectURL(avatarFile)} alt="Avatar preview" />
									<span>{t.newAvatar}</span>
								</div>
							{:else if avatar}
								<div class="preview">
									<img src={avatar} alt="Avatar preview" />
									<span>{t.currentAvatar}</span>
								</div>
							{/if}
						</div>

						<div class="form-group">
							<label for="banner">
								<Image size={18} />
								{t.bannerImage}
							</label>
							<input
								id="banner"
								type="file"
								accept="image/*"
								on:change={handleBannerChange}
								disabled={saving}
							/>
							{#if bannerFile}
								<div class="preview banner-preview">
									<img src={URL.createObjectURL(bannerFile)} alt="Banner preview" />
									<span>{t.newBanner}</span>
								</div>
							{:else if banner}
								<div class="preview banner-preview">
									<img src={banner} alt="Banner preview" />
									<span>{t.currentBanner}</span>
								</div>
							{/if}
						</div>
					</div>

					<div class="form-actions">
						<a href="/channel/{user.id}" class="btn-secondary">{t.cancel}</a>
						<button type="submit" class="btn-primary" disabled={saving}>
							{saving ? (lang === 'ru' ? 'Сохранение...' : 'Saving...') : t.saveChanges}
						</button>
					</div>
				</form>
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

	.settings-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 32px 24px;
	}

	h1 {
		font-size: 32px;
		font-weight: 600;
		margin-bottom: 32px;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--text-secondary);
		font-size: 18px;
	}

	.message {
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 24px;
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
	}

	.message.success {
		background: rgba(75, 181, 67, 0.2);
		color: #4bb543;
	}

	.form-section {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 24px;
		margin-bottom: 24px;
	}

	.form-section h2 {
		font-size: 20px;
		font-weight: 500;
		margin-bottom: 20px;
		color: var(--text-primary);
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group:last-child {
		margin-bottom: 0;
	}

	label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 8px;
		color: var(--text-primary);
	}

	input,
	textarea {
		width: 100%;
		padding: 12px 16px;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 15px;
		outline: none;
		transition: border-color 0.2s;
	}

	input:focus,
	textarea:focus {
		border-color: var(--accent);
	}

	input:disabled,
	textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	textarea {
		resize: vertical;
		font-family: 'Roboto', sans-serif;
	}

	.preview {
		margin-top: 12px;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.preview img {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--border);
	}

	.preview.banner-preview img {
		width: 120px;
		height: 40px;
		border-radius: 8px;
	}

	.preview span {
		font-size: 12px;
		color: var(--text-secondary);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 32px;
	}

	.form-actions a,
	.form-actions button {
		padding: 12px 24px;
		border-radius: 24px;
		font-size: 15px;
		font-weight: 500;
		text-decoration: none;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}

	@media (max-width: 768px) {
		.settings-container {
			padding: 20px 16px;
		}

		h1 {
			font-size: 22px;
			margin-bottom: 24px;
		}

		.form-section {
			padding: 20px 16px;
		}

		.form-section h2 {
			font-size: 18px;
			margin-bottom: 16px;
		}

		label {
			font-size: 13px;
		}

		input,
		textarea {
			font-size: 15px;
			padding: 10px 12px;
		}

		.form-actions {
			flex-direction: column;
			margin-top: 24px;
		}

		.form-actions a,
		.form-actions button {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.settings-container {
			padding: 16px 12px;
		}

		h1 {
			font-size: 20px;
			margin-bottom: 20px;
		}

		.form-section {
			padding: 16px 12px;
		}

		.form-section h2 {
			font-size: 16px;
		}

		.preview {
			flex-direction: column;
			align-items: flex-start;
		}

		.preview img {
			width: 50px;
			height: 50px;
		}

		.preview.banner-preview img {
			width: 100px;
			height: 33px;
		}
	}
</style>
