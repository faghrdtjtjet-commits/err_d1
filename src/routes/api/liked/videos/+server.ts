import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const videos = db.prepare(`
			SELECT v.*, u.username, u.avatar as user_avatar,
				   (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
				   (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'dislike') as dislikes
			FROM videos v
			JOIN users u ON v.user_id = u.id
			JOIN likes l ON v.id = l.video_id
			WHERE l.user_id = ? AND l.type = 'like'
			ORDER BY l.created_at DESC
		`).all(user.id);

		return json({ videos });
	} catch (error) {
		return json({ error: 'Failed to load liked videos' }, { status: 500 });
	}
};
