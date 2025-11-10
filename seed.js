import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'vibetube.db'));

console.log('🌱 Seeding database...');

const hashedPassword = bcrypt.hashSync('password123', 10);

const user1 = db.prepare(`
	INSERT INTO users (username, email, password, avatar, description)
	VALUES (?, ?, ?, ?, ?)
`).run(
	'TechGuru',
	'tech@example.com',
	hashedPassword,
	'https://ui-avatars.com/api/?name=TechGuru&background=9b59b6&color=fff',
	'Technology enthusiast sharing cool tech videos!'
);

const user2 = db.prepare(`
	INSERT INTO users (username, email, password, avatar, description)
	VALUES (?, ?, ?, ?, ?)
`).run(
	'CookingMaster',
	'cook@example.com',
	hashedPassword,
	'https://ui-avatars.com/api/?name=CookingMaster&background=b174d4&color=fff',
	'Delicious recipes and cooking tips!'
);

const user3 = db.prepare(`
	INSERT INTO users (username, email, password, avatar, description)
	VALUES (?, ?, ?, ?, ?)
`).run(
	'GamePlayer',
	'gamer@example.com',
	hashedPassword,
	'https://ui-avatars.com/api/?name=GamePlayer&background=8e44ad&color=fff',
	'Epic gaming moments and walkthroughs!'
);

const videos = [
	{
		userId: user1.lastInsertRowid,
		title: 'Introduction to JavaScript ES2024',
		description: 'Learn about the latest features in JavaScript ES2024. Perfect for beginners and advanced developers!',
		thumbnail: 'https://picsum.photos/seed/js/1280/720',
		duration: 840
	},
	{
		userId: user1.lastInsertRowid,
		title: 'Building a REST API with Node.js',
		description: 'Complete tutorial on creating a RESTful API using Node.js and Express.',
		thumbnail: 'https://picsum.photos/seed/nodejs/1280/720',
		duration: 1200
	},
	{
		userId: user2.lastInsertRowid,
		title: 'Perfect Homemade Pizza Recipe',
		description: 'Make the best pizza at home with this simple recipe. Crispy crust, amazing taste!',
		thumbnail: 'https://picsum.photos/seed/pizza/1280/720',
		duration: 600
	},
	{
		userId: user2.lastInsertRowid,
		title: 'Quick & Healthy Breakfast Ideas',
		description: '5 breakfast recipes you can make in under 10 minutes. Delicious and nutritious!',
		thumbnail: 'https://picsum.photos/seed/breakfast/1280/720',
		duration: 480
	},
	{
		userId: user3.lastInsertRowid,
		title: 'Epic Game Highlights - Best Moments',
		description: 'The most amazing gaming moments from last week. You won\'t believe #3!',
		thumbnail: 'https://picsum.photos/seed/gaming/1280/720',
		duration: 720
	},
	{
		userId: user3.lastInsertRowid,
		title: 'Complete Walkthrough - Level 10',
		description: 'Detailed walkthrough of level 10 with all secrets and collectibles.',
		thumbnail: 'https://picsum.photos/seed/walkthrough/1280/720',
		duration: 960
	},
	{
		userId: user1.lastInsertRowid,
		title: 'TypeScript Tips & Tricks',
		description: '10 TypeScript tips that will make you a better developer.',
		thumbnail: 'https://picsum.photos/seed/typescript/1280/720',
		duration: 540
	},
	{
		userId: user2.lastInsertRowid,
		title: 'Baking the Perfect Chocolate Cake',
		description: 'Step-by-step guide to baking a moist and delicious chocolate cake.',
		thumbnail: 'https://picsum.photos/seed/cake/1280/720',
		duration: 900
	}
];

videos.forEach((video) => {
	const result = db.prepare(`
		INSERT INTO videos (user_id, title, description, video_url, thumbnail_url, duration, views)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`).run(
		video.userId,
		video.title,
		video.description,
		'/uploads/sample-video.mp4',
		video.thumbnail,
		video.duration,
		Math.floor(Math.random() * 100000)
	);

	const videoId = result.lastInsertRowid;

	const randomLikes = Math.floor(Math.random() * 1000) + 100;
	const randomDislikes = Math.floor(Math.random() * 50);

	for (let i = 0; i < Math.min(randomLikes, 20); i++) {
		try {
			db.prepare(`
				INSERT INTO likes (video_id, user_id, type)
				VALUES (?, ?, 'like')
			`).run(videoId, Math.floor(Math.random() * 3) + 1);
		} catch (e) {}
	}

	db.prepare(`
		INSERT INTO comments (video_id, user_id, content)
		VALUES (?, ?, ?)
	`).run(videoId, Math.floor(Math.random() * 3) + 1, 'Great video! Thanks for sharing!');

	db.prepare(`
		INSERT INTO comments (video_id, user_id, content)
		VALUES (?, ?, ?)
	`).run(videoId, Math.floor(Math.random() * 3) + 1, 'Very helpful content 👍');
});

db.prepare('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)').run(1, 2);
db.prepare('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)').run(1, 3);
db.prepare('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)').run(2, 1);
db.prepare('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)').run(3, 1);

console.log('✅ Database seeded successfully!');
console.log('\nTest accounts:');
console.log('- tech@example.com / password123');
console.log('- cook@example.com / password123');
console.log('- gamer@example.com / password123');

db.close();
