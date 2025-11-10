import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';

export const GET: RequestHandler = async (event) => {
	try {
		const userId = event.params.id;
		
		const user = db.prepare(`
			SELECT id, username, email, avatar, banner, description, created_at
			FROM users 
			WHERE id = ?
		`).get(userId);

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ user });
	} catch (error) {
		return json({ error: 'Failed to fetch user' }, { status: 500 });
	}
};
