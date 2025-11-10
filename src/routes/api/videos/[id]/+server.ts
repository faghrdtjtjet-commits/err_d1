import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ params }) => {
	const video = db.prepare(`
		SELECT 
			v.*,
			u.username,
			u.avatar as user_avatar,
			u.description as user_description,
			(SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
			(SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'dislike') as dislikes,
			(SELECT COUNT(*) FROM subscriptions WHERE channel_id = v.user_id) as subscribers
		FROM videos v
		JOIN users u ON v.user_id = u.id
		WHERE v.id = ?
	`).get(params.id);

	if (!video) {
		return json({ error: 'Video not found' }, { status: 404 });
	}

	db.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(params.id);

	return json({ video });
};

export const DELETE: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(event.params.id) as any;

	if (!video) {
		return json({ error: 'Video not found' }, { status: 404 });
	}

	if (video.user_id !== user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	db.prepare('DELETE FROM videos WHERE id = ?').run(event.params.id);

	return json({ success: true });
};
