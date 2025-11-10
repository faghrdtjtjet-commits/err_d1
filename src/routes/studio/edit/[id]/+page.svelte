<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Save } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let video: any = null;
	let loading = true;
	let saving = false;
	let message = '';

	$: lang = $language;
	$: t = translations[lang];

	let title = '';
	let description = '';
	let thumbnailFile: File | null = null;
	let thumbnailPreview: string = '';

	$: videoId = $page.params.id;

	onMount(async () => {
		const userRes = await fetch('/api/auth/me');
		if (!userRes.ok) {
			window.location.href = '/login';
			return;
		}
		const userData = await userRes.json();
		user = userData.user;

		await loadVideo();
	});

	async function loadVideo() {
		const res = await fetch(`/api/videos/${videoId}`);
		if (res.ok) {
			const data = await res.json();
			video = data.video;
			
			if (video.user_id !== user.id) {
				goto('/studio/videos');
				return;
			}

			title = video.title;
			description = video.description || '';
			thumbnailPreview = video.thumbnail_url || video.thumbnail;
		}
		loading = false;
	}

	function handleThumbnailChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			thumbnailFile = input.files[0];
			thumbnailPreview = URL.createObjectURL(thumbnailFile);
		}
	}

	async function handleSave(e: Event) {
		e.preventDefault();
		saving = true;
		message = '';

		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		if (thumbnailFile) {
			formData.append('thumbnail', thumbnailFile);
		}

		const res = await fetch(`/api/videos/${videoId}/update`, {
			method: 'PUT',
			body: formData
		});

		if (res.ok) {
			message = lang === 'ru' ? 'Видео успешно обновлено!' : 'Video updated successfully!';
			setTimeout(() => goto('/studio/videos'), 1500);
		} else {
			const data = await res.json();
			message = data.error || (lang === 'ru' ? 'Не удалось обновить видео' : 'Failed to update video');
		}

		saving = false;
	}
</script>

<svelte:head>
	<title>Edit Video - Creator Studio</title>
</svelte:head>

<div class="studio">
	<Header {user} onMenuClick={() => {}} />
	
	<div class="studio-layout">
		<main class="studio-main full-width">
			<div class="edit-container">
				<h1>{t.editVideo}</h1>

				{#if loading}
					<div class="loading">{t.loading}</div>
				{:else if video}
					<form on:submit={handleSave}>
						{#if message}
							<div class="message" class:success={message.includes('success')}>
								{message}
							</div>
						{/if}

						<div class="form-row">
							<div class="form-column">
								<div class="form-group">
									<label for="title">{t.title} *</label>
									<input
										id="title"
										type="text"
										bind:value={title}
										placeholder={lang === 'ru' ? 'Название видео' : 'Video title'}
										required
										disabled={saving}
										maxlength="100"
									/>
									<span class="char-count">{title.length}/100</span>
								</div>

								<div class="form-group">
									<label for="description">{t.description}</label>
									<textarea
										id="description"
										bind:value={description}
										placeholder={lang === 'ru' ? 'Расскажите зрителям о вашем видео' : 'Tell viewers about your video'}
										rows="10"
										disabled={saving}
										maxlength="5000"
									></textarea>
									<span class="char-count">{description.length}/5000</span>
								</div>

								<div class="form-group">
									<label for="thumbnail">{t.thumbnail}</label>
									<input
										id="thumbnail"
										type="file"
										accept="image/*"
										on:change={handleThumbnailChange}
										disabled={saving}
									/>
									{#if thumbnailPreview}
										<div class="thumbnail-preview">
											<img src={thumbnailPreview} alt="Thumbnail preview" />
											<span>{thumbnailFile ? (lang === 'ru' ? 'Новое превью (не сохранено)' : 'New thumbnail (not saved)') : (lang === 'ru' ? 'Текущее превью' : 'Current thumbnail')}</span>
										</div>
									{/if}
								</div>

								<div class="form-actions">
									<a href="/studio/videos" class="btn-secondary">{t.cancel}</a>
									<button type="submit" class="btn-primary" disabled={saving}>
										<Save size={18} />
										{saving ? (lang === 'ru' ? 'Сохранение...' : 'Saving...') : t.saveChanges}
									</button>
								</div>
							</div>

							<div class="preview-column">
								<h3>{lang === 'ru' ? 'Предпросмотр' : 'Preview'}</h3>
								<div class="video-preview">
									{#if thumbnailPreview}
										<img src={thumbnailPreview} alt={title} />
									{:else}
										<div class="no-thumb">{lang === 'ru' ? 'Нет превью' : 'No thumbnail'}</div>
									{/if}
									<div class="preview-info">
										<h4>{title || (lang === 'ru' ? 'Видео без названия' : 'Untitled Video')}</h4>
										<p>{description || (lang === 'ru' ? 'Нет описания' : 'No description')}</p>
										<span class="preview-stats">{video.views} {t.views}</span>
									</div>
								</div>
							</div>
						</div>
					</form>
				{/if}
			</div>
		</main>
	</div>
</div>

<style>
	.studio { min-height: 100vh; background: var(--bg-primary); }
	.studio-layout { margin-top: 56px; }
	
	.studio-main.full-width {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 32px;
	}

	.edit-container h1 {
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

	.form-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 32px;
	}

	.form-group {
		margin-bottom: 24px;
		position: relative;
	}

	label {
		display: block;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 8px;
	}

	input, textarea {
		width: 100%;
		padding: 12px 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 15px;
		font-family: 'Roboto', sans-serif;
		outline: none;
	}

	input:focus, textarea:focus {
		border-color: var(--accent);
	}

	.char-count {
		position: absolute;
		bottom: -20px;
		right: 0;
		font-size: 12px;
		color: var(--text-secondary);
	}

	.form-actions {
		display: flex;
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
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.preview-column h3 {
		font-size: 18px;
		margin-bottom: 16px;
	}

	.video-preview {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
	}

	.video-preview img,
	.no-thumb {
		width: 100%;
		aspect-ratio: 16/9;
		object-fit: cover;
	}

	.no-thumb {
		background: var(--bg-hover);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
	}

	.preview-info {
		padding: 16px;
	}

	.preview-info h4 {
		font-size: 16px;
		margin-bottom: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.preview-info p {
		font-size: 14px;
		color: var(--text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 8px;
	}

	.preview-stats {
		font-size: 12px;
		color: var(--text-secondary);
	}

	@media (max-width: 1024px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.preview-column {
			order: -1;
		}
	}

	@media (max-width: 768px) {
		.studio-main.full-width {
			padding: 16px;
		}

		.edit-container h1 {
			font-size: 24px;
		}

		.form-actions {
			flex-direction: column;
		}

		.form-actions a,
		.form-actions button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
