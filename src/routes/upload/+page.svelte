<script lang="ts">
	import { onMount } from 'svelte';
	import { Upload as UploadIcon, Video } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let sidebarOpen = true;

	$: lang = $language;
	$: t = translations[lang];
	let title = '';
	let description = '';
	let videoFile: File | null = null;
	let thumbnailFile: File | null = null;
	let uploading = false;
	let error = '';
	let dragOver = false;

	onMount(async () => {
		const res = await fetch('/api/auth/me');
		if (!res.ok) {
			window.location.href = '/login';
			return;
		}
		const data = await res.json();
		user = data.user;
	});

	function handleVideoChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			videoFile = input.files[0];
		}
	}

	function handleThumbnailChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			thumbnailFile = input.files[0];
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		
		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			if (file.type.startsWith('video/')) {
				videoFile = file;
			}
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (!videoFile) {
			error = lang === 'ru' ? 'Пожалуйста, выберите видеофайл' : 'Please select a video file';
			return;
		}

		if (!title.trim()) {
			error = lang === 'ru' ? 'Пожалуйста, введите название' : 'Please enter a title';
			return;
		}

		uploading = true;

		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		formData.append('video', videoFile);
		if (thumbnailFile) {
			formData.append('thumbnail', thumbnailFile);
		}

		const res = await fetch('/api/videos', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const data = await res.json();
			window.location.href = `/watch/${data.video.id}`;
		} else {
			const data = await res.json();
			error = data.error || (lang === 'ru' ? 'Ошибка загрузки' : 'Upload failed');
			uploading = false;
		}
	}
</script>

<svelte:head>
	<title>Upload Video - VibeTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="upload-container">
			<div class="upload-card">
				<div class="header">
					<Video size={32} />
					<h1>{t.uploadVideo}</h1>
				</div>

				<form on:submit={handleSubmit}>
					{#if error}
						<div class="error">{error}</div>
					{/if}

					<div
						class="drop-zone"
						class:drag-over={dragOver}
						role="button"
						tabindex="0"
						on:drop={handleDrop}
						on:dragover={(e) => {
							e.preventDefault();
							dragOver = true;
						}}
						on:dragleave={() => (dragOver = false)}
					>
						<UploadIcon size={48} />
						<p>{t.dragDrop}</p>
						<span>{lang === 'ru' ? 'или' : 'or'}</span>
						<label class="file-label">
							<input type="file" accept="video/*" on:change={handleVideoChange} disabled={uploading} />
							{t.selectFile}
						</label>
						{#if videoFile}
							<p class="file-info">{lang === 'ru' ? 'Выбрано' : 'Selected'}: {videoFile.name}</p>
						{/if}
					</div>

					<div class="form-group">
						<label for="title">{t.title} *</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							placeholder={lang === 'ru' ? 'Введите название видео' : 'Enter video title'}
							required
							disabled={uploading}
						/>
					</div>

					<div class="form-group">
						<label for="description">{t.description}</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder={lang === 'ru' ? 'Расскажите зрителям о вашем видео' : 'Tell viewers about your video'}
							rows="5"
							disabled={uploading}
						></textarea>
					</div>

					<div class="form-group">
						<label for="thumbnail">{t.thumbnail} ({lang === 'ru' ? 'необязательно' : 'optional'})</label>
						<input
							id="thumbnail"
							type="file"
							accept="image/*"
							on:change={handleThumbnailChange}
							disabled={uploading}
						/>
						{#if thumbnailFile}
							<p class="file-info">{lang === 'ru' ? 'Выбрано' : 'Selected'}: {thumbnailFile.name}</p>
						{/if}
					</div>

					<button type="submit" class="btn-primary" disabled={uploading}>
						{uploading ? t.uploading : t.uploadVideo}
					</button>
				</form>
			</div>
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

	.upload-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 32px 24px;
	}

	.upload-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 32px;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 32px;
	}

	h1 {
		font-size: 28px;
		font-weight: 600;
	}

	.error {
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 14px;
	}

	.drop-zone {
		border: 2px dashed var(--border);
		border-radius: 12px;
		padding: 48px;
		text-align: center;
		margin-bottom: 24px;
		transition: all 0.3s;
		cursor: pointer;
	}

	.drop-zone.drag-over {
		border-color: var(--accent);
		background: rgba(62, 166, 255, 0.1);
	}

	.drop-zone p {
		margin: 16px 0 8px;
		color: var(--text-primary);
		font-size: 16px;
	}

	.drop-zone span {
		color: var(--text-secondary);
		font-size: 14px;
	}

	.file-label {
		display: inline-block;
		margin-top: 16px;
		padding: 10px 24px;
		background: var(--accent);
		color: white;
		border-radius: 24px;
		cursor: pointer;
		font-weight: 500;
		transition: background 0.2s;
	}

	.file-label:hover {
		background: var(--accent-hover);
	}

	.file-label input {
		display: none;
	}

	.file-info {
		margin-top: 12px;
		color: var(--accent);
		font-size: 14px;
	}

	.form-group {
		margin-bottom: 24px;
	}

	label {
		display: block;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 8px;
	}

	input[type='text'],
	textarea {
		width: 100%;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 15px;
		resize: vertical;
	}

	input[type='file'] {
		width: 100%;
		padding: 8px;
		border-radius: 8px;
	}

	button[type='submit'] {
		width: 100%;
		padding: 14px;
		font-size: 16px;
		font-weight: 500;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}

	@media (max-width: 768px) {
		main {
			padding: 0;
		}

		.upload-container {
			padding: 20px 16px;
		}

		.upload-card {
			padding: 24px 16px;
		}

		h1 {
			font-size: 22px;
		}

		.drop-zone {
			padding: 32px 20px;
		}

		.form-group label {
			font-size: 13px;
		}

		.form-group input,
		.form-group textarea {
			font-size: 15px;
			padding: 10px 12px;
		}
	}

	@media (max-width: 480px) {
		.upload-container {
			padding: 16px 12px;
		}

		.upload-card {
			padding: 20px 12px;
			border-radius: 12px;
		}

		h1 {
			font-size: 20px;
			margin-bottom: 20px;
		}

		.header {
			gap: 12px;
			margin-bottom: 24px;
		}

		.form-actions {
			flex-direction: column;
			gap: 12px;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
			justify-content: center;
		}

		.drop-zone {
			min-height: 180px;
			padding: 24px 16px;
		}

		.drop-zone p {
			font-size: 15px;
		}

		.drop-zone span {
			font-size: 13px;
		}

		.file-info {
			padding: 10px;
		}
	}
</style>
