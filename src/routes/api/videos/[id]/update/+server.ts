import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getUserFromRequest } from '$lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const PUT: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const thumbnailFile = formData.get('thumbnail') as File | null;
		const videoId = event.params.id;

		console.log('Update video request:', { 
			videoId, 
			title, 
			hasThumbnail: !!thumbnailFile,
			thumbnailSize: thumbnailFile?.size 
		});

		if (!title) {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(videoId) as any;

		if (!video) {
			return json({ error: 'Video not found' }, { status: 404 });
		}

		if (video.user_id !== user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		let thumbnailUrl = video.thumbnail_url || video.thumbnail;

		if (thumbnailFile && thumbnailFile.size > 0) {
			try {
				const uploadsDir = join(process.cwd(), 'static', 'uploads');
				await mkdir(uploadsDir, { recursive: true });

				const ext = thumbnailFile.name.split('.').pop();
				const filename = `thumb_${videoId}_${Date.now()}.${ext}`;
				const filePath = join(uploadsDir, filename);
				const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
				await writeFile(filePath, buffer);
				thumbnailUrl = `/uploads/${filename}`;
				console.log('Thumbnail saved:', thumbnailUrl);
			} catch (fileError) {
				console.error('File upload error:', fileError);
				return json({ error: 'Failed to upload thumbnail: ' + fileError.message }, { status: 500 });
			}
		}

		// Update both thumbnail fields for compatibility
		db.prepare(`
			UPDATE videos 
			SET title = ?, description = ?, thumbnail_url = ?, thumbnail = ?
			WHERE id = ?
		`).run(title, description || null, thumbnailUrl, thumbnailUrl, videoId);

		const updatedVideo = db.prepare('SELECT * FROM videos WHERE id = ?').get(videoId);

		return json({ video: updatedVideo });
	} catch (error: any) {
		console.error('Update error:', error);
		return json({ error: 'Failed to update video: ' + error.message }, { status: 500 });
	}
};
