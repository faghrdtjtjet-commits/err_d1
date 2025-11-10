import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { videoId, type } = await event.request.json();

		if (!videoId || !type || !['like', 'dislike'].includes(type)) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const existing = db.prepare('SELECT * FROM likes WHERE video_id = ? AND user_id = ?').get(videoId, user.id) as any;

		if (existing) {
			if (existing.type === type) {
				db.prepare('DELETE FROM likes WHERE video_id = ? AND user_id = ?').run(videoId, user.id);
				return json({ action: 'removed', type });
			} else {
				db.prepare('UPDATE likes SET type = ? WHERE video_id = ? AND user_id = ?').run(type, videoId, user.id);
				return json({ action: 'updated', type });
			}
		} else {
			db.prepare('INSERT INTO likes (video_id, user_id, type) VALUES (?, ?, ?)').run(videoId, user.id, type);
			return json({ action: 'added', type });
		}
	} catch (error) {
		console.error('Like error:', error);
		return json({ error: 'Failed to process like' }, { status: 500 });
	}
};

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	const videoId = event.url.searchParams.get('videoId');

	if (!user || !videoId) {
		return json({ like: null });
	}

	const like = db.prepare('SELECT type FROM likes WHERE video_id = ? AND user_id = ?').get(videoId, user.id) as any;

	return json({ like: like?.type || null });
};
