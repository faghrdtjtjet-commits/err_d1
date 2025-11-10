import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const commentId = event.params.id;

		// Verify user is video author
		const comment = db.prepare(`
			SELECT c.*, v.user_id as video_author_id
			FROM comments c
			JOIN videos v ON c.video_id = v.id
			WHERE c.id = ?
		`).get(commentId) as any;

		if (!comment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		if (comment.video_author_id !== user.id) {
			return json({ error: 'Only video author can pin comments' }, { status: 403 });
		}

		// Unpin all other comments on this video first
		db.prepare('UPDATE comments SET is_pinned = 0 WHERE video_id = ?').run(comment.video_id);

		// Toggle pin on this comment
		const newPinned = comment.is_pinned ? 0 : 1;
		db.prepare('UPDATE comments SET is_pinned = ? WHERE id = ?').run(newPinned, commentId);

		return json({ is_pinned: newPinned });
	} catch (error) {
		console.error('Pin error:', error);
		return json({ error: 'Failed to pin comment' }, { status: 500 });
	}
};
