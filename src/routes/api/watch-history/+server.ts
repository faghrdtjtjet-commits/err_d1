import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const { videoId } = await event.request.json();
		db.prepare('INSERT INTO watch_history (user_id, video_id) VALUES (?, ?)').run(user.id, videoId);
		return json({ success: true });
	} catch (error) {
		return json({ success: false });
	}
};

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const videos = db.prepare(`
			SELECT DISTINCT v.*, u.username, u.avatar as user_avatar,
				   (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
				   (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'dislike') as dislikes,
				   wh.watched_at
			FROM videos v
			JOIN users u ON v.user_id = u.id
			JOIN watch_history wh ON v.id = wh.video_id
			WHERE wh.user_id = ?
			ORDER BY wh.watched_at DESC
			LIMIT 50
		`).all(user.id);

		return json({ videos });
	} catch (error) {
		return json({ error: 'Failed to load history' }, { status: 500 });
	}
};
