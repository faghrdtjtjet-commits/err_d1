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
		const { channelId } = await event.request.json();

		if (!channelId) {
			return json({ error: 'Channel ID is required' }, { status: 400 });
		}

		if (channelId === user.id) {
			return json({ error: 'Cannot subscribe to yourself' }, { status: 400 });
		}

		const existing = db.prepare('SELECT * FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?').get(user.id, channelId);

		if (existing) {
			db.prepare('DELETE FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?').run(user.id, channelId);
			return json({ subscribed: false });
		} else {
			db.prepare('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)').run(user.id, channelId);
			return json({ subscribed: true });
		}
	} catch (error) {
		console.error('Subscription error:', error);
		return json({ error: 'Failed to process subscription' }, { status: 500 });
	}
};

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	const channelId = event.url.searchParams.get('channelId');

	if (!user || !channelId) {
		return json({ subscribed: false });
	}

	const subscription = db.prepare('SELECT * FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?').get(user.id, channelId);

	return json({ subscribed: !!subscription });
};
