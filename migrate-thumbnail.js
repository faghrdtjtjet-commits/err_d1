import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'vibetube.db');
const db = new Database(DB_PATH);

try {
	// Add thumbnail column if it doesn't exist
	db.exec(`
		ALTER TABLE videos ADD COLUMN thumbnail TEXT;
	`);
	console.log('✅ Migration completed: thumbnail column added');
} catch (error) {
	if (error.message.includes('duplicate column name')) {
		console.log('✅ Column already exists, skipping migration');
	} else {
		console.error('❌ Migration error:', error);
	}
}

db.close();
