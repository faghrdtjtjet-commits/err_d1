<script lang="ts">
	import { onMount } from 'svelte';
	import { formatTimeAgo } from '$lib/utils';
	import { ThumbsUp, ThumbsDown, Heart, Pin, CornerDownRight, MoreVertical } from 'lucide-svelte';
	import { language, translations } from '$lib/i18n';

	export let videoId: number;
	export let user: any = null;
	export let videoAuthorId: number;

	$: lang = $language;
	$: t = translations[lang];

	let comments: any[] = [];
	let newComment = '';
	let loading = false;
	let replyingTo: number | null = null;
	let replyContent = '';
	let openMenuId: number | null = null;
	let commentLikes: Map<number, string> = new Map();
	let editingCommentId: number | null = null;
	let editContent = '';

	onMount(async () => {
		await loadComments();
	});

	async function loadComments() {
		const res = await fetch(`/api/comments?videoId=${videoId}`);
		if (res.ok) {
			const data = await res.json();
			comments = data.comments;
			
			// Load like status for each comment
			if (user) {
				for (const comment of comments) {
					await loadCommentLikeStatus(comment.id);
					if (comment.replies) {
						for (const reply of comment.replies) {
							await loadCommentLikeStatus(reply.id);
						}
					}
				}
			}
		}
	}

	async function loadCommentLikeStatus(commentId: number) {
		if (!user) return;
		const res = await fetch(`/api/comments/${commentId}/like`);
		if (res.ok) {
			const data = await res.json();
			if (data.like) {
				commentLikes.set(commentId, data.like);
				commentLikes = commentLikes;
			}
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!newComment.trim() || loading) return;

		loading = true;
		const res = await fetch('/api/comments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ videoId, content: newComment })
		});

		if (res.ok) {
			newComment = '';
			await loadComments();
		}
		loading = false;
	}

	async function handleReply(parentId: number) {
		if (!replyContent.trim() || loading) return;

		loading = true;
		const res = await fetch('/api/comments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ videoId, content: replyContent, parentId })
		});

		if (res.ok) {
			replyContent = '';
			replyingTo = null;
			await loadComments();
		}
		loading = false;
	}

	async function handleLike(commentId: number, type: 'like' | 'dislike') {
		if (!user) return;
		const res = await fetch(`/api/comments/${commentId}/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type })
		});
		if (res.ok) {
			const data = await res.json();
			if (data.action === 'removed') {
				commentLikes.delete(commentId);
			} else {
				commentLikes.set(commentId, type);
			}
			commentLikes = commentLikes;
			await loadComments();
		}
	}

	async function handleHeart(commentId: number) {
		const res = await fetch(`/api/comments/${commentId}/heart`, { method: 'POST' });
		if (res.ok) await loadComments();
	}

	async function handlePin(commentId: number) {
		const res = await fetch(`/api/comments/${commentId}/pin`, { method: 'POST' });
		if (res.ok) await loadComments();
	}

	async function handleDeleteComment(commentId: number) {
		const confirmMsg = lang === 'ru' ? 'Удалить этот комментарий?' : 'Delete this comment?';
		if (!confirm(confirmMsg)) return;
		const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
		if (res.ok) await loadComments();
	}

	function startEditComment(commentId: number, content: string) {
		editingCommentId = commentId;
		editContent = content;
	}

	async function handleEditComment(commentId: number) {
		if (!editContent.trim()) return;
		const res = await fetch(`/api/comments?id=${commentId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content: editContent })
		});
		if (res.ok) {
			editingCommentId = null;
			editContent = '';
			await loadComments();
		}
	}
</script>

<div class="comments">
	<h3>{comments.length} {t.comments}</h3>

	{#if user}
		<form on:submit={handleSubmit}>
			<img src={user.avatar} alt={user.username} class="avatar" />
			<div class="input-wrapper">
				<input
					type="text"
					placeholder={t.addComment}
					bind:value={newComment}
					disabled={loading}
				/>
				<div class="actions">
					<button type="button" on:click={() => (newComment = '')} disabled={loading}>
						{t.cancel}
					</button>
					<button type="submit" class="btn-primary" disabled={!newComment.trim() || loading}>
						{t.comment}
					</button>
				</div>
			</div>
		</form>
	{/if}

	<div class="comments-list">
		{#each comments as comment (comment.id)}
			<div class="comment" class:pinned={comment.is_pinned}>
				{#if comment.is_pinned}
					<div class="pinned-badge">
						<Pin size={14} />
						{t.pinnedBy}
					</div>
				{/if}
				
				<img src={comment.avatar} alt={comment.username} class="avatar" />
				<div class="comment-content">
					<div class="comment-header">
						<span class="username">{comment.username}</span>
						<span class="time">{formatTimeAgo(comment.created_at, lang)}</span>
						{#if comment.is_hearted}
							<span class="heart-badge">
								<Heart size={14} fill="currentColor" />
							</span>
						{/if}
					</div>
					
					{#if editingCommentId === comment.id}
						<div class="edit-form">
							<input type="text" bind:value={editContent} />
							<button class="btn-primary small" on:click={() => handleEditComment(comment.id)}>{t.save}</button>
							<button class="btn-secondary small" on:click={() => { editingCommentId = null; editContent = ''; }}>{t.cancel}</button>
						</div>
					{:else}
						<p>{comment.content}</p>
					{/if}
					
					<div class="comment-actions">
						<button class="action-btn" class:active={commentLikes.get(comment.id) === 'like'} on:click={() => handleLike(comment.id, 'like')}>
							<ThumbsUp size={16} />
							<span>{comment.likes || 0}</span>
						</button>
						<button class="action-btn" class:active={commentLikes.get(comment.id) === 'dislike'} on:click={() => handleLike(comment.id, 'dislike')}>
							<ThumbsDown size={16} />
						</button>
						{#if user}
							<button class="action-btn" on:click={() => replyingTo = replyingTo === comment.id ? null : comment.id}>
								<CornerDownRight size={16} />
								{t.reply}
							</button>
						{/if}
						
						{#if user}
							{#if user.id === comment.user_id}
								<div class="menu-wrapper">
									<button class="action-btn" on:click={() => openMenuId = openMenuId === comment.id ? null : comment.id}>
										<MoreVertical size={16} />
									</button>
									{#if openMenuId === comment.id}
										<div class="menu">
											<button on:click={() => { startEditComment(comment.id, comment.content); openMenuId = null; }}>
												{t.edit}
											</button>
											<button on:click={() => { handleDeleteComment(comment.id); openMenuId = null; }}>
												{t.delete}
											</button>
										</div>
									{/if}
								</div>
							{:else if videoAuthorId === user.id}
								<div class="menu-wrapper">
									<button class="action-btn" on:click={() => openMenuId = openMenuId === comment.id ? null : comment.id}>
										<MoreVertical size={16} />
									</button>
									{#if openMenuId === comment.id}
										<div class="menu">
											<button on:click={() => { handleHeart(comment.id); openMenuId = null; }}>
												<Heart size={16} />
												{comment.is_hearted ? t.removeHeart : t.heartComment}
											</button>
											<button on:click={() => { handlePin(comment.id); openMenuId = null; }}>
												<Pin size={16} />
												{comment.is_pinned ? t.unpin : t.pinComment}
											</button>
										</div>
									{/if}
								</div>
							{/if}
						{/if}
					</div>

					{#if replyingTo === comment.id}
						<div class="reply-form">
							<img src={user.avatar} alt={user.username} class="avatar small" />
							<input
								type="text"
								placeholder={t.addReply}
								bind:value={replyContent}
								on:keydown={(e) => e.key === 'Enter' && handleReply(comment.id)}
							/>
							<button class="btn-primary small" on:click={() => handleReply(comment.id)} disabled={!replyContent.trim()}>
								{t.reply}
							</button>
							<button class="btn-secondary small" on:click={() => { replyingTo = null; replyContent = ''; }}>
								{t.cancel}
							</button>
						</div>
					{/if}

					{#if comment.replies && comment.replies.length > 0}
						<div class="replies">
							{#each comment.replies as reply (reply.id)}
								<div class="comment reply">
									<img src={reply.avatar} alt={reply.username} class="avatar small" />
									<div class="comment-content">
										<div class="comment-header">
											<span class="username">{reply.username}</span>
											<span class="time">{formatTimeAgo(reply.created_at, lang)}</span>
											{#if reply.is_hearted}
												<span class="heart-badge">
													<Heart size={14} fill="currentColor" />
												</span>
											{/if}
										</div>
										<p>{reply.content}</p>
										
										<div class="comment-actions">
											<button class="action-btn" class:active={commentLikes.get(reply.id) === 'like'} on:click={() => handleLike(reply.id, 'like')}>
												<ThumbsUp size={14} />
												<span>{reply.likes || 0}</span>
											</button>
											<button class="action-btn" class:active={commentLikes.get(reply.id) === 'dislike'} on:click={() => handleLike(reply.id, 'dislike')}>
												<ThumbsDown size={14} />
											</button>
											
											{#if user && videoAuthorId === user.id && reply.user_id !== user.id}
												<button class="action-btn" on:click={() => handleHeart(reply.id)}>
													<Heart size={14} fill={reply.is_hearted ? 'currentColor' : 'none'} />
												</button>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.comments {
		margin-top: 24px;
	}

	h3 {
		font-size: 20px;
		margin-bottom: 24px;
	}

	form {
		display: flex;
		gap: 16px;
		margin-bottom: 32px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.input-wrapper {
		flex: 1;
	}

	input {
		width: 100%;
		padding: 8px 0;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--border);
		font-size: 14px;
	}

	input:focus {
		border-bottom-color: var(--accent);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 12px;
	}

	.actions button {
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 14px;
	}

	.actions button[type='button'] {
		color: var(--text-secondary);
	}

	.actions button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.comments-list {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.comment {
		display: flex;
		gap: 16px;
	}

	.comment-content {
		flex: 1;
	}

	.comment-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.username {
		font-weight: 500;
		font-size: 13px;
	}

	.time {
		font-size: 12px;
		color: var(--text-secondary);
	}

	.comment p {
		font-size: 14px;
		line-height: 1.5;
	}

	.comment.pinned {
		background: rgba(155, 89, 182, 0.1);
		border: 1px solid var(--accent);
		border-radius: 8px;
		padding: 16px;
		position: relative;
		padding-top: 32px;
	}

	.pinned-badge {
		position: absolute;
		top: 8px;
		left: 16px;
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--accent);
		font-weight: 500;
	}

	.heart-badge {
		color: #e74c3c;
		display: flex;
		align-items: center;
	}

	.comment-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		position: relative;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		background: none;
		border: none;
		border-radius: 20px;
		color: var(--text-secondary);
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn:hover {
		background: var(--bg-hover);
	}

	.action-btn.active {
		color: var(--accent);
	}

	.action-btn.active :global(svg) {
		fill: var(--accent);
	}

	.menu-wrapper {
		position: relative;
	}

	.menu {
		position: absolute;
		top: 100%;
		right: 0;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 8px;
		min-width: 180px;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.menu button {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: none;
		border: none;
		color: var(--text-primary);
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		text-align: left;
	}

	.menu button:hover {
		background: var(--bg-hover);
	}

	.reply-form {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 12px;
		padding: 12px;
		background: var(--bg-hover);
		border-radius: 8px;
	}

	.reply-form input {
		flex: 1;
		padding: 8px 12px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 20px;
		font-size: 14px;
	}

	.edit-form {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 8px 0;
	}

	.edit-form input {
		flex: 1;
		padding: 8px 12px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		font-size: 14px;
	}

	.reply-form .btn-primary.small,
	.reply-form .btn-secondary.small {
		padding: 6px 16px;
		font-size: 13px;
	}

	.avatar.small {
		width: 32px;
		height: 32px;
	}

	.replies {
		margin-top: 16px;
		margin-left: 40px;
		padding-left: 16px;
		border-left: 2px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.reply .comment-content {
		flex: 1;
	}

	.reply .action-btn {
		padding: 4px 8px;
		font-size: 12px;
	}

	@media (max-width: 768px) {
		.comments-container h2 {
			font-size: 18px;
		}

		.comment {
			padding: 12px 0;
		}

		.avatar {
			width: 32px;
			height: 32px;
		}

		.username {
			font-size: 12px;
		}

		.time {
			font-size: 11px;
		}

		.comment p {
			font-size: 13px;
		}

		.action-btn {
			font-size: 12px;
			padding: 5px 10px;
		}

		.replies {
			margin-left: 20px;
			padding-left: 12px;
		}

		.reply-form {
			flex-wrap: wrap;
			padding: 10px;
		}

		.reply-form input {
			width: 100%;
			font-size: 15px;
		}

		.menu {
			min-width: 160px;
		}

		.menu button {
			font-size: 13px;
			padding: 6px 10px;
		}
	}

	@media (max-width: 480px) {
		.comments-container h2 {
			font-size: 16px;
		}

		.comment {
			padding: 10px 0;
		}

		.avatar {
			width: 28px;
			height: 28px;
		}

		.avatar.small {
			width: 26px;
			height: 26px;
		}

		.comment.pinned {
			padding: 12px;
			padding-top: 28px;
		}

		.pinned-badge {
			font-size: 11px;
			top: 6px;
			left: 12px;
		}

		.comment-actions {
			flex-wrap: wrap;
			gap: 6px;
		}

		.action-btn {
			font-size: 11px;
			padding: 4px 8px;
		}

		.replies {
			margin-left: 14px;
			padding-left: 8px;
			border-left-width: 1px;
		}

		.reply-form {
			padding: 8px;
			gap: 8px;
		}

		.reply-form input {
			font-size: 14px;
			padding: 6px 10px;
		}

		.reply-form .btn-primary.small,
		.reply-form .btn-secondary.small {
			padding: 5px 12px;
			font-size: 12px;
		}
	}
</style>
