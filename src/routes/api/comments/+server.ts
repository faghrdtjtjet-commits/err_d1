import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ url }) => {
	const videoId = url.searchParams.get('videoId');

	if (!videoId) {
		return json({ error: 'Video ID is required' }, { status: 400 });
	}

	const comments = db.prepare(`
		SELECT c.*, u.username, u.avatar,
			(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'like') as likes,
			(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'dislike') as dislikes,
			(SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count
		FROM comments c
		JOIN users u ON c.user_id = u.id
		WHERE c.video_id = ? AND c.parent_id IS NULL
		ORDER BY c.is_pinned DESC, c.created_at DESC
	`).all(videoId);

	// Load replies for each comment
	const commentsWithReplies = comments.map((comment: any) => {
		const replies = db.prepare(`
			SELECT c.*, u.username, u.avatar,
				(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'like') as likes,
				(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'dislike') as dislikes
			FROM comments c
			JOIN users u ON c.user_id = u.id
			WHERE c.parent_id = ?
			ORDER BY c.created_at ASC
		`).all(comment.id);

		return { ...comment, replies };
	});

	return json({ comments: commentsWithReplies });
};

export const POST: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { videoId, content, parentId } = await event.request.json();

		if (!videoId || !content) {
			return json({ error: 'Video ID and content are required' }, { status: 400 });
		}

		const result = db.prepare(`
			INSERT INTO comments (video_id, user_id, content, parent_id)
			VALUES (?, ?, ?, ?)
		`).run(videoId, user.id, content, parentId || null);

		const comment = db.prepare(`
			SELECT c.*, u.username, u.avatar,
				(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'like') as likes,
				(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'dislike') as dislikes
			FROM comments c
			JOIN users u ON c.user_id = u.id
			WHERE c.id = ?
		`).get(result.lastInsertRowid);

		return json({ comment }, { status: 201 });
	} catch (error) {
		console.error('Comment error:', error);
		return json({ error: 'Failed to create comment' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const commentId = event.url.searchParams.get('id');
		if (!commentId) {
			return json({ error: 'Comment ID required' }, { status: 400 });
		}

		const comment = db.prepare('SELECT user_id FROM comments WHERE id = ?').get(commentId) as any;
		if (!comment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		if (comment.user_id !== user.id) {
			return json({ error: 'Not authorized to delete this comment' }, { status: 403 });
		}

		db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);
		return json({ success: true });
	} catch (error) {
		console.error('Delete comment error:', error);
		return json({ error: 'Failed to delete comment' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const commentId = event.url.searchParams.get('id');
		const { content } = await event.request.json();

		if (!commentId || !content) {
			return json({ error: 'Comment ID and content required' }, { status: 400 });
		}

		const comment = db.prepare('SELECT user_id FROM comments WHERE id = ?').get(commentId) as any;
		if (!comment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		if (comment.user_id !== user.id) {
			return json({ error: 'Not authorized to edit this comment' }, { status: 403 });
		}

		db.prepare('UPDATE comments SET content = ? WHERE id = ?').run(content, commentId);
		return json({ success: true });
	} catch (error) {
		console.error('Edit comment error:', error);
		return json({ error: 'Failed to edit comment' }, { status: 500 });
	}
};
