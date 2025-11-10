import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getVideoDuration(filePath: string): Promise<number> {
	try {
		const { stdout } = await execAsync(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
		);
		return Math.floor(parseFloat(stdout.trim()));
	} catch (error) {
		console.error('Error getting video duration:', error);
		return 0;
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const search = url.searchParams.get('search') || '';
	const userId = url.searchParams.get('userId');

	let query = `
		SELECT 
			v.*,
			u.username,
			u.avatar as user_avatar,
			u.banner,
			(SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
			(SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'dislike') as dislikes
		FROM videos v
		JOIN users u ON v.user_id = u.id
	`;

	const params: any[] = [];

	if (userId) {
		query += ' WHERE v.user_id = ?';
		params.push(userId);
	} else if (search) {
		query += ' WHERE v.title LIKE ? OR v.description LIKE ?';
		params.push(`%${search}%`, `%${search}%`);
	}

	query += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
	params.push(limit, offset);

	const videos = db.prepare(query).all(...params);

	return json({ videos });
};

export const POST: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const videoFile = formData.get('video') as File;
		const thumbnailFile = formData.get('thumbnail') as File;

		if (!title || !videoFile) {
			return json({ error: 'Title and video are required' }, { status: 400 });
		}

		const videoExt = videoFile.name.split('.').pop();
		const thumbnailExt = thumbnailFile?.name.split('.').pop();
		const timestamp = Date.now();

		const videoFilename = `video_${user.id}_${timestamp}.${videoExt}`;
		const thumbnailFilename = thumbnailFile ? `thumb_${user.id}_${timestamp}.${thumbnailExt}` : null;

		const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
		const fs = await import('fs/promises');
		
		const uploadsDir = 'static/uploads';
		await fs.mkdir(uploadsDir, { recursive: true });
		const videoPath = `${uploadsDir}/${videoFilename}`;
		await fs.writeFile(videoPath, videoBuffer);

		if (thumbnailFile && thumbnailFilename) {
			const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
			await fs.writeFile(`${uploadsDir}/${thumbnailFilename}`, thumbnailBuffer);
		}

		// Get video duration using ffprobe
		const duration = await getVideoDuration(videoPath);

		const thumbnailPath = thumbnailFilename ? `/uploads/${thumbnailFilename}` : null;
		
		const result = db.prepare(`
			INSERT INTO videos (user_id, title, description, video_url, thumbnail_url, thumbnail, duration)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`).run(
			user.id,
			title,
			description || '',
			`/uploads/${videoFilename}`,
			thumbnailPath,
			thumbnailPath,
			duration
		);

		const video = db.prepare(`
			SELECT v.*, u.username, u.avatar as user_avatar
			FROM videos v
			JOIN users u ON v.user_id = u.id
			WHERE v.id = ?
		`).get(result.lastInsertRowid);

		return json({ video }, { status: 201 });
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
