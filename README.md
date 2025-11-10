# 🎥 VibeTube

A realistic YouTube clone built with **SvelteKit** and **SQLite** - everything in one project, ready to run!

![VibeTube](https://img.shields.io/badge/VibeTube-Modern%20Video%20Platform-3EA6FF?style=for-the-badge)

## ✨ Features

- 🎬 **Video Upload** - Upload videos with thumbnails (drag & drop support)
- 👤 **User Authentication** - Register, login, JWT-based sessions
- 💬 **Comments** - Real-time commenting system
- 👍 **Likes & Dislikes** - Interact with videos
- 🔔 **Subscriptions** - Follow your favorite creators
- 🔍 **Search** - Find videos by title and description
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Theme** - Professional YouTube-style UI
- ⚡ **Fast Performance** - SSR with SvelteKit + SQLite

## 🛠 Tech Stack

- **Frontend & Backend**: SvelteKit (TypeScript)
- **Database**: SQLite with Better-SQLite3
- **Authentication**: JWT with bcryptjs
- **File Uploads**: Native FormData handling
- **Styling**: Custom CSS (YouTube-inspired)
- **Icons**: Lucide Svelte

## 📁 Project Structure

```
VibeTube/
├── src/
│   ├── lib/
│   │   ├── components/      # UI Components
│   │   │   ├── Header.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   ├── VideoCard.svelte
│   │   │   ├── VideoGrid.svelte
│   │   │   └── Comments.svelte
│   │   ├── db.ts           # Database schema & initialization
│   │   ├── auth.ts         # JWT authentication
│   │   └── utils.ts        # Helper functions
│   ├── routes/
│   │   ├── api/            # API Endpoints
│   │   │   ├── auth/       # Login, register, logout
│   │   │   ├── videos/     # Video CRUD
│   │   │   ├── comments/   # Comments
│   │   │   ├── likes/      # Likes/dislikes
│   │   │   └── subscriptions/
│   │   ├── watch/[id]/     # Video player page
│   │   ├── channel/[id]/   # Channel page
│   │   ├── search/         # Search results
│   │   ├── upload/         # Upload page
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   └── +page.svelte    # Home page
│   ├── app.html
│   └── app.css
├── static/
│   └── uploads/            # User-uploaded videos & thumbnails
├── vibetube.db             # SQLite database (auto-created)
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation

1. **Clone or navigate to the project**:
```bash
cd VibeTube
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
```
http://localhost:5173
```

That's it! The database will be created automatically on first run.

## 📝 Usage

### Register a New Account
1. Go to http://localhost:5173/register
2. Create your account
3. You'll be automatically logged in

### Upload a Video
1. Click "Upload" in the header
2. Drag & drop your video or click to select
3. Add title, description, and thumbnail (optional)
4. Click "Upload Video"

### Watch & Interact
- Browse videos on the home page
- Click a video to watch
- Like/dislike, comment, and subscribe
- Search for videos using the search bar

## 🗄 Database Schema

The SQLite database includes:
- **users** - User accounts
- **videos** - Video metadata
- **comments** - User comments
- **likes** - Likes and dislikes
- **subscriptions** - Channel subscriptions
- **watch_history** - View tracking

All tables are created automatically on first run.

## 🎨 Customization

### Change Colors
Edit `src/app.css`:
```css
:root {
  --bg-primary: #0f0f0f;
  --bg-secondary: #212121;
  --accent: #3ea6ff;
  /* ... */
}
```

### Add New Features
- API routes go in `src/routes/api/`
- Pages go in `src/routes/`
- Components go in `src/lib/components/`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - List videos (supports search, pagination)
- `POST /api/videos` - Upload video
- `GET /api/videos/[id]` - Get video details
- `DELETE /api/videos/[id]` - Delete video

### Comments
- `GET /api/comments?videoId=X` - Get comments
- `POST /api/comments` - Add comment

### Likes
- `POST /api/likes` - Like/dislike video
- `GET /api/likes?videoId=X` - Get user's like status

### Subscriptions
- `POST /api/subscriptions` - Subscribe/unsubscribe
- `GET /api/subscriptions?channelId=X` - Check subscription status

## 🚢 Production Build

```bash
npm run build
npm run preview
```

## 📦 Dependencies

```json
{
  "better-sqlite3": "^11.8.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "lucide-svelte": "^0.469.0",
  "cookie": "^1.0.2"
}
```

## 🐛 Troubleshooting

**Database locked error?**
- Make sure only one instance is running
- Delete `vibetube.db` and restart

**Video not playing?**
- Ensure your video format is MP4 (H.264)
- Check browser console for errors

**Upload fails?**
- Check file size (large files may timeout)
- Ensure `static/uploads/` directory is writable

## 🤝 Contributing

This is a demonstration project, but feel free to:
- Fork and extend it
- Report bugs
- Suggest features

## 📄 License

MIT License - Feel free to use for learning and projects!

## 🌟 Credits

Built with ❤️ using:
- [SvelteKit](https://kit.svelte.dev/)
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- [Lucide Icons](https://lucide.dev/)

---

**VibeTube** - Your videos, your vibe! 🎵
