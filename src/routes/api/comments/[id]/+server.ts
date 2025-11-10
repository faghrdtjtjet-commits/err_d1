import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const DELETE: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const commentId = event.params.id;
		
		if (!commentId) {
			return json({ error: 'Comment ID required' }, { status: 400 });
		}

		// Get comment info including video owner
		const comment = db.prepare(`
			SELECT c.user_id, c.video_id, v.user_id as video_owner_id 
			FROM comments c
			JOIN videos v ON c.video_id = v.id
			WHERE c.id = ?
		`).get(commentId) as any;

		if (!comment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		// Allow deletion if user is comment author OR video owner
		if (comment.user_id !== user.id && comment.video_owner_id !== user.id) {
			return json({ error: 'Not authorized to delete this comment' }, { status: 403 });
		}

		// Delete comment (this will also delete replies due to CASCADE)
		db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);
		
		return json({ success: true });
	} catch (error) {
		console.error('Delete comment error:', error);
		return json({ error: 'Failed to delete comment' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const commentId = event.params.id;
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
