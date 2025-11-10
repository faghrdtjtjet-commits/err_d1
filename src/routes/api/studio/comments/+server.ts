import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const comments = db.prepare(`
			SELECT c.*, u.username, v.title as video_title
			FROM comments c
			JOIN users u ON c.user_id = u.id
			JOIN videos v ON c.video_id = v.id
			WHERE v.user_id = ?
			ORDER BY c.created_at DESC
		`).all(user.id);

		return json({ comments });
	} catch (error) {
		return json({ error: 'Failed to load comments' }, { status: 500 });
	}
};
