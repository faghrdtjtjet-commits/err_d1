import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	return json(
		{ success: true },
		{
			status: 200,
			headers: {
				'Set-Cookie': 'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
			}
		}
	);
};
