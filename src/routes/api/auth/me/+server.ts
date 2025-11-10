import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserFromRequest } from '$lib/auth';
import db from '$lib/db';

export const GET: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const fullUser = db.prepare(`
		SELECT id, username, email, avatar, banner, description, created_at
		FROM users WHERE id = ?
	`).get(user.id);

	return json({ user: fullUser });
};
