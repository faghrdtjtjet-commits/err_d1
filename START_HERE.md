# 🎉 Welcome to VibeTube!

**A complete YouTube clone built with SvelteKit + SQLite**

---

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

**That's it!** The database will be created automatically. ✨

---

## 🎯 What is VibeTube?

VibeTube is a **fully functional YouTube clone** with:
- ✅ Video upload and playback
- ✅ User authentication
- ✅ Comments, likes, subscriptions
- ✅ Search functionality
- ✅ Channel pages
- ✅ Responsive design
- ✅ Professional UI

**All in one project** - no separate frontend/backend!

---

## 📚 Documentation

### For Quick Start
- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes

### For Understanding the Project
- **[README.md](README.md)** - Complete overview
- **[PROJECT_INFO.md](PROJECT_INFO.md)** - Architecture details
- **[FEATURES.md](FEATURES.md)** - All features (150+)
- **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** - Code organization

### For Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

---

## 🎨 What You'll See

### Home Page
- Grid of video thumbnails
- Search bar in header
- Collapsible sidebar navigation

### Video Page
- Full video player
- Like/dislike buttons
- Comments section
- Related videos sidebar

### Upload Page
- Drag & drop video upload
- Thumbnail upload
- Title and description form

### Authentication
- Clean login/register pages
- JWT-based sessions
- User profiles

---

## 🛠 Tech Stack

- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety
- **SQLite** - Database
- **Better-SQLite3** - Fast DB access
- **JWT** - Authentication
- **Lucide Icons** - Beautiful icons
- **Custom CSS** - YouTube-style design

---

## 📦 What's Included

### Code
- ✅ 5 UI components
- ✅ 7 pages
- ✅ 9 API endpoints
- ✅ Complete database schema
- ✅ Authentication system
- ✅ File upload handling

### Documentation
- ✅ 6 detailed guides
- ✅ API documentation
- ✅ Code comments
- ✅ Deployment instructions

### Tools
- ✅ Demo data generator (`npm run seed`)
- ✅ Development server
- ✅ Production build scripts

---

## 🎓 Great For Learning

This project teaches:
- Full-stack SvelteKit development
- Database design
- REST API creation
- File uploads
- Authentication (JWT)
- TypeScript usage
- Component architecture
- Responsive CSS

---

## 🚀 Next Steps

### 1. Run the Project
```bash
npm install
npm run dev
```

### 2. Add Demo Data (Optional)
```bash
npm run seed
```
Creates 3 users and 8 videos with interactions.

**Test accounts**:
- `tech@example.com` / `password123`
- `cook@example.com` / `password123`
- `gamer@example.com` / `password123`

### 3. Start Exploring
- Register a new account
- Upload a video
- Comment and like
- Search for videos

---

## 📖 Key Files to Explore

### Backend
1. `src/lib/db.ts` - Database schema
2. `src/lib/auth.ts` - Authentication
3. `src/routes/api/**` - API endpoints

### Frontend
1. `src/app.css` - Global styles
2. `src/lib/components/**` - UI components
3. `src/routes/**/+page.svelte` - Pages

---

## 🎯 Features Overview

### User Features
- Register & login
- Upload videos with thumbnails
- Watch videos
- Comment on videos
- Like/dislike videos
- Subscribe to channels
- Search for content
- View channel pages

### Technical Features
- Server-side rendering (SSR)
- Client-side navigation (SPA)
- JWT authentication
- File upload handling
- SQLite database
- Responsive design
- Type-safe code

---

## 📱 Project Structure

```
VibeTube/
├── src/
│   ├── lib/              # Utilities & components
│   └── routes/           # Pages & API
├── static/               # Static files & uploads
├── *.md                  # Documentation
└── package.json          # Dependencies
```

Simple and organized! 🎉

---

## 🆘 Need Help?

### Common Issues

**Server won't start?**
- Make sure Node.js 18+ is installed
- Run `npm install` again

**Database errors?**
- Delete `vibetube.db` and restart
- Database will be recreated automatically

**Upload not working?**
- Check if `static/uploads/` exists
- Try with small video files first

### Documentation

- Read **[QUICK_START.md](QUICK_START.md)** for detailed setup
- Check **[README.md](README.md)** for full documentation
- See **[PROJECT_INFO.md](PROJECT_INFO.md)** for architecture

---

## 🌟 What Makes This Special?

### 1. Complete Implementation
Not a tutorial project - this is **production-ready** code with proper architecture.

### 2. One Project
No separate client/server repositories. Everything works together seamlessly.

### 3. Zero Configuration
Just `npm install` and `npm run dev`. Database is created automatically.

### 4. Well Documented
6 detailed guides covering everything from setup to deployment.

### 5. Modern Stack
Latest versions of SvelteKit, TypeScript, and best practices.

### 6. Real Features
150+ features including everything you'd expect from a video platform.

---

## 🎬 Ready to Start?

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** and enjoy! 🚀

---

## 📝 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run seed             # Add demo data

# Utilities
npm run check            # Type-check code
```

---

## 🎯 Your First Steps

1. **Install & Run**
   ```bash
   npm install && npm run dev
   ```

2. **Register Account**
   - Go to http://localhost:5173/register
   - Create your account

3. **Upload Video**
   - Click "Upload" in header
   - Add your first video

4. **Explore**
   - Watch videos
   - Add comments
   - Like and subscribe

---

## 🔥 Pro Tips

- Use `npm run seed` to see the app with data
- Check the browser console for useful logs
- Database file is `vibetube.db` in root
- Uploads go to `static/uploads/`
- All styles are in `src/app.css`

---

## 📚 Learning Path

1. **Start Here**: Setup and run (this file)
2. **Understand**: Read [README.md](README.md)
3. **Explore Code**: Check [FILE_STRUCTURE.md](FILE_STRUCTURE.md)
4. **Deep Dive**: Read [PROJECT_INFO.md](PROJECT_INFO.md)
5. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎉 You're All Set!

VibeTube is ready to use. Start the server and build something amazing!

**Happy coding! 🚀**

---

*Built with ❤️ using SvelteKit*
