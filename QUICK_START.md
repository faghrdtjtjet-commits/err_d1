# 🚀 Quick Start Guide - VibeTube

## Installation & Launch (3 steps)

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open in browser**:
```
http://localhost:5173
```

The SQLite database (`vibetube.db`) will be created automatically on first run! ✨

---

## Optional: Add Demo Data

Want to see the app with sample videos and users?

```bash
npm run seed
```

This creates 3 test accounts:
- `tech@example.com` / `password123`
- `cook@example.com` / `password123`
- `gamer@example.com` / `password123`

And 8 sample videos with comments and likes!

---

## How to Use

### 1️⃣ Register
- Go to `/register`
- Create your account
- Start using immediately

### 2️⃣ Upload a Video
- Click "Upload" in header
- Drag & drop your video (or click to select)
- Add title, description, and thumbnail
- Click "Upload Video"

### 3️⃣ Watch & Interact
- Browse videos on home page
- Click to watch
- Like/dislike, comment, subscribe
- Search for videos

---

## Features Available

✅ User authentication (JWT)  
✅ Video upload with thumbnails  
✅ Comments system  
✅ Likes/Dislikes  
✅ Subscriptions  
✅ Search functionality  
✅ Channel pages  
✅ Responsive design  
✅ Dark theme (YouTube-style)  

---

## Tech Stack

- **Frontend & Backend**: SvelteKit + TypeScript
- **Database**: SQLite (Better-SQLite3)
- **Auth**: JWT + bcryptjs
- **Styling**: Custom CSS
- **Icons**: Lucide Svelte

---

## Project Structure

```
VibeTube/
├── src/
│   ├── lib/
│   │   ├── components/      # UI components
│   │   ├── db.ts           # Database
│   │   ├── auth.ts         # Authentication
│   │   └── utils.ts        # Helpers
│   ├── routes/
│   │   ├── api/            # REST API
│   │   ├── +page.svelte    # Home
│   │   ├── watch/[id]/     # Video player
│   │   ├── channel/[id]/   # Channel page
│   │   ├── upload/         # Upload page
│   │   ├── search/         # Search results
│   │   ├── login/          # Login page
│   │   └── register/       # Register page
│   ├── app.html
│   └── app.css
├── static/uploads/         # Uploaded files
├── vibetube.db            # Database (auto-created)
└── package.json
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - List videos
- `POST /api/videos` - Upload video
- `GET /api/videos/[id]` - Get video
- `DELETE /api/videos/[id]` - Delete video

### Comments
- `GET /api/comments?videoId=X` - Get comments
- `POST /api/comments` - Add comment

### Likes
- `POST /api/likes` - Like/dislike
- `GET /api/likes?videoId=X` - Get user's like

### Subscriptions
- `POST /api/subscriptions` - Subscribe/unsubscribe
- `GET /api/subscriptions?channelId=X` - Check status

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Troubleshooting

**Can't start server?**
- Make sure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again

**Database errors?**
- Delete `vibetube.db` and restart
- The database will be recreated automatically

**Upload not working?**
- Ensure `static/uploads/` directory exists
- Check video format (MP4 recommended)

---

## Need Help?

Check the full `README.md` for detailed documentation.

---

**Happy coding! 🎉**
