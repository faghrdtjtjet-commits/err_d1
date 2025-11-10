import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { hashPassword, generateToken } from '$lib/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { username, email, password } = await request.json();

		if (!username || !email || !password) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		if (password.length < 6) {
			return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
		}

		const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);

		if (existingUser) {
			return json({ error: 'User already exists' }, { status: 409 });
		}

		const hashedPassword = hashPassword(password);

		const result = db.prepare(`
			INSERT INTO users (username, email, password, avatar)
			VALUES (?, ?, ?, ?)
		`).run(username, email, hashedPassword, `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=9b59b6&color=fff`);

		const user = {
			id: result.lastInsertRowid as number,
			username,
			email
		};

		const token = generateToken(user);

		return json(
			{ user, token },
			{
				status: 201,
				headers: {
					'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
				}
			}
		);
	} catch (error) {
		console.error('Register error:', error);
		return json({ error: 'Registration failed' }, { status: 500 });
	}
};
