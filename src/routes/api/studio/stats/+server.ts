import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const totalViews = db.prepare(`
			SELECT COALESCE(SUM(views), 0) as total
			FROM videos
			WHERE user_id = ?
		`).get(user.id) as any;

		const totalVideos = db.prepare(`
			SELECT COUNT(*) as total
			FROM videos
			WHERE user_id = ?
		`).get(user.id) as any;

		const totalLikes = db.prepare(`
			SELECT COUNT(*) as total
			FROM likes l
			JOIN videos v ON l.video_id = v.id
			WHERE v.user_id = ? AND l.type = 'like'
		`).get(user.id) as any;

		const totalComments = db.prepare(`
			SELECT COUNT(*) as total
			FROM comments c
			JOIN videos v ON c.video_id = v.id
			WHERE v.user_id = ?
		`).get(user.id) as any;

		const subscribers = db.prepare(`
			SELECT COUNT(*) as total
			FROM subscriptions
			WHERE channel_id = ?
		`).get(user.id) as any;

		return json({
			totalViews: totalViews.total,
			totalVideos: totalVideos.total,
			totalLikes: totalLikes.total,
			totalComments: totalComments.total,
			subscribers: subscribers.total
		});
	} catch (error) {
		console.error('Stats error:', error);
		return json({ error: 'Failed to load stats' }, { status: 500 });
	}
};
