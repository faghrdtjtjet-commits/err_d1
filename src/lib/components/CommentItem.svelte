<script lang="ts">
	import { ThumbsUp, ThumbsDown, Heart, Pin, CornerDownRight, MoreVertical } from 'lucide-svelte';
	import { formatTimeAgo } from '$lib/utils';

	export let comment: any;
	export let user: any = null;
	export let videoAuthorId: number;
	export let onReply: (commentId: number) => void;
	export let onPin: (commentId: number) => void;
	export let onHeart: (commentId: number) => void;
	export let onLike: (commentId: number, type: 'like' | 'dislike') => void;

	let showMenu = false;
	let userLike: string | null = null;

	$: isAuthor = user && user.id === videoAuthorId;
	$: isCommentAuthor = user && user.id === comment.user_id;

	async function loadUserLike() {
		if (!user) return;
		const res = await fetch(`/api/comments/${comment.id}/like-status`);
		if (res.ok) {
			const data = await res.json();
			userLike = data.like;
		}
	}

	$: if (user && comment) {
		loadUserLike();
	}

	function handleLike(type: 'like' | 'dislike') {
		onLike(comment.id, type);
		if (userLike === type) {
			userLike = null;
		} else {
			userLike = type;
		}
	}
</script>

<div class="comment" class:pinned={comment.is_pinned}>
	{#if comment.is_pinned}
		<div class="pinned-badge">
			<Pin size={14} />
			Pinned by author
		</div>
	{/if}
	
	<img src={comment.avatar} alt={comment.username} class="avatar" />
	
	<div class="comment-body">
		<div class="comment-header">
			<span class="username">{comment.username}</span>
			<span class="time">{formatTimeAgo(comment.created_at)}</span>
			{#if comment.is_hearted}
				<span class="heart-badge">
					<Heart size={14} fill="currentColor" />
				</span>
			{/if}
		</div>
		
		<p class="comment-text">{comment.content}</p>
		
		<div class="comment-actions">
			<button class="action-btn" class:active={userLike === 'like'} on:click={() => handleLike('like')}>
				<ThumbsUp size={16} />
				<span>{comment.likes || 0}</span>
			</button>
			<button class="action-btn" class:active={userLike === 'dislike'} on:click={() => handleLike('dislike')}>
				<ThumbsDown size={16} />
			</button>
			{#if user}
				<button class="action-btn" on:click={() => onReply(comment.id)}>
					<CornerDownRight size={16} />
					Reply
				</button>
			{/if}
			
			{#if isAuthor || isCommentAuthor}
				<div class="menu-wrapper">
					<button class="action-btn" on:click={() => showMenu = !showMenu}>
						<MoreVertical size={16} />
					</button>
					{#if showMenu}
						<div class="menu">
							{#if isAuthor && !isCommentAuthor}
								<button on:click={() => { onHeart(comment.id); showMenu = false; }}>
									<Heart size={16} />
									{comment.is_hearted ? 'Remove Heart' : 'Heart'}
								</button>
								<button on:click={() => { onPin(comment.id); showMenu = false; }}>
									<Pin size={16} />
									{comment.is_pinned ? 'Unpin' : 'Pin'}
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.comment {
		display: flex;
		gap: 16px;
		padding: 16px;
		border-radius: 8px;
		position: relative;
	}

	.comment.pinned {
		background: rgba(155, 89, 182, 0.1);
		border: 1px solid var(--accent);
	}

	.pinned-badge {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--accent);
		padding: 4px 16px;
		background: rgba(155, 89, 182, 0.2);
		border-radius: 8px 8px 0 0;
	}

	.comment.pinned .avatar {
		margin-top: 24px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.comment-body {
		flex: 1;
		min-width: 0;
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

	.heart-badge {
		color: #e74c3c;
		display: flex;
		align-items: center;
	}

	.comment-text {
		font-size: 14px;
		line-height: 1.5;
		margin-bottom: 8px;
		word-wrap: break-word;
	}

	.comment-actions {
		display: flex;
		align-items: center;
		gap: 8px;
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
		min-width: 150px;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 4px;
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
</style>
