# 📂 VibeTube File Structure

Complete overview of all files in the project.

---

## 📁 Root Directory

```
VibeTube/
├── 📄 .gitignore                 # Git ignore rules
├── 📄 .npmrc                     # npm configuration
├── 📄 package.json               # Dependencies & scripts
├── 📄 package-lock.json          # Locked dependencies
├── 📄 svelte.config.js           # SvelteKit configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 vite.config.ts             # Vite build configuration
├── 📄 seed.js                    # Demo data generator
├── 📄 README.md                  # Main documentation
├── 📄 QUICK_START.md             # Getting started guide
├── 📄 PROJECT_INFO.md            # Detailed project info
├── 📄 FEATURES.md                # Feature list
└── 📄 FILE_STRUCTURE.md          # This file
```

---

## 📁 Source Code (`src/`)

### Root Level
```
src/
├── 📄 app.html                   # HTML template
├── 📄 app.css                    # Global styles
└── 📄 app.d.ts                   # TypeScript declarations
```

### Library (`src/lib/`)
```
src/lib/
├── 📂 components/                # UI Components
│   ├── 📄 Header.svelte          # Navigation header
│   ├── 📄 Sidebar.svelte         # Collapsible sidebar
│   ├── 📄 VideoCard.svelte       # Video preview card
│   ├── 📄 VideoGrid.svelte       # Grid layout
│   └── 📄 Comments.svelte        # Comment section
├── 📄 db.ts                      # Database schema & init
├── 📄 auth.ts                    # JWT authentication
├── 📄 utils.ts                   # Helper functions
└── 📄 index.ts                   # Library exports
```

### Routes (`src/routes/`)

#### Pages
```
src/routes/
├── 📄 +layout.svelte             # Root layout
├── 📄 +page.svelte               # Home page (/)
├── 📂 watch/[id]/                # Video player
│   └── 📄 +page.svelte
├── 📂 channel/[id]/              # Channel page
│   └── 📄 +page.svelte
├── 📂 search/                    # Search results
│   └── 📄 +page.svelte
├── 📂 upload/                    # Video upload
│   └── 📄 +page.svelte
├── 📂 login/                     # Login page
│   └── 📄 +page.svelte
└── 📂 register/                  # Registration page
    └── 📄 +page.svelte
```

#### API Routes
```
src/routes/api/
├── 📂 auth/                      # Authentication
│   ├── 📂 register/
│   │   └── 📄 +server.ts         # POST register
│   ├── 📂 login/
│   │   └── 📄 +server.ts         # POST login
│   ├── 📂 logout/
│   │   └── 📄 +server.ts         # POST logout
│   └── 📂 me/
│       └── 📄 +server.ts         # GET current user
├── 📂 videos/                    # Video management
│   ├── 📄 +server.ts             # GET list, POST upload
│   └── 📂 [id]/
│       └── 📄 +server.ts         # GET, DELETE video
├── 📂 comments/
│   └── 📄 +server.ts             # GET, POST comments
├── 📂 likes/
│   └── 📄 +server.ts             # GET, POST likes
└── 📂 subscriptions/
    └── 📄 +server.ts             # GET, POST subscriptions
```

---

## 📁 Static Files (`static/`)

```
static/
├── 📂 uploads/                   # User-uploaded files
│   └── 📄 .gitkeep               # Keep folder in git
└── 📄 robots.txt                 # SEO configuration
```

---

## 📁 Generated Files (Not in Git)

### Database
```
📄 vibetube.db                    # SQLite database
📄 vibetube.db-shm                # Shared memory file
📄 vibetube.db-wal                # Write-ahead log
```

### Build Output
```
📁 .svelte-kit/                   # SvelteKit cache
📁 build/                         # Production build
📁 node_modules/                  # Dependencies
```

---

## 📊 File Statistics

### By Type
- **TypeScript**: 12 files (.ts)
- **Svelte**: 14 files (.svelte)
- **JavaScript**: 1 file (.js)
- **Markdown**: 5 files (.md)
- **Config**: 6 files (.json, .js, .ts)
- **HTML**: 1 file (.html)
- **CSS**: 1 file (.css)

### By Category
- **API Routes**: 9 endpoints
- **Pages**: 7 pages
- **Components**: 5 components
- **Utilities**: 3 files
- **Documentation**: 5 files
- **Configuration**: 6 files

---

## 🗂 Detailed Breakdown

### Core Application Files (19)
1. `src/app.html` - HTML template
2. `src/app.css` - Global styles
3. `src/app.d.ts` - Type declarations
4. `src/routes/+layout.svelte` - Root layout
5. `src/routes/+page.svelte` - Home page
6. `src/lib/db.ts` - Database
7. `src/lib/auth.ts` - Authentication
8. `src/lib/utils.ts` - Utilities
9-13. Components (5 files)
14-20. Pages (7 files)

### API Endpoints (9)
1. Register
2. Login
3. Logout
4. Get current user
5. List/upload videos
6. Get/delete video
7. Get/post comments
8. Get/post likes
9. Get/post subscriptions

### Configuration Files (6)
1. `package.json` - Dependencies
2. `tsconfig.json` - TypeScript
3. `svelte.config.js` - SvelteKit
4. `vite.config.ts` - Build tool
5. `.gitignore` - Git
6. `.npmrc` - npm

### Documentation (5)
1. `README.md` - Main docs
2. `QUICK_START.md` - Getting started
3. `PROJECT_INFO.md` - Detailed info
4. `FEATURES.md` - Feature list
5. `FILE_STRUCTURE.md` - This file

---

## 📏 Code Size (Approximate)

- **TypeScript/JavaScript**: ~2,500 lines
- **Svelte Components**: ~2,000 lines
- **CSS**: ~500 lines
- **Documentation**: ~2,000 lines
- **Total**: ~7,000 lines

---

## 🎯 Key Files to Understand

### For Backend Development
1. `src/lib/db.ts` - Database schema
2. `src/lib/auth.ts` - Authentication logic
3. `src/routes/api/**/*+server.ts` - API endpoints

### For Frontend Development
1. `src/app.css` - Global styles
2. `src/lib/components/*.svelte` - UI components
3. `src/routes/**/+page.svelte` - Page components

### For Configuration
1. `package.json` - Dependencies
2. `svelte.config.js` - Framework config
3. `vite.config.ts` - Build config

---

## 🔍 File Naming Conventions

### SvelteKit Conventions
- `+page.svelte` - Page component
- `+server.ts` - API endpoint
- `+layout.svelte` - Layout component
- `[id]` - Dynamic route parameter

### Custom Conventions
- `PascalCase.svelte` - Reusable components
- `lowercase.ts` - Utility modules
- `UPPERCASE.md` - Documentation files

---

## 📦 Dependencies Location

All dependencies are managed in:
- `package.json` - Dependency list
- `package-lock.json` - Locked versions
- `node_modules/` - Installed packages (ignored)

---

## 🚀 Build Artifacts

Generated during build:
- `.svelte-kit/` - Build cache
- `build/` - Production output
- `vibetube.db` - Runtime database

All ignored by Git!

---

## 📝 Quick Reference

### Add New Page
1. Create `src/routes/pagename/+page.svelte`

### Add New API Route
1. Create `src/routes/api/endpoint/+server.ts`
2. Export GET, POST, etc. handlers

### Add New Component
1. Create `src/lib/components/Name.svelte`
2. Import in pages

### Modify Database
1. Edit `src/lib/db.ts`
2. Delete `vibetube.db` to recreate

---

**VibeTube** - Clean, organized, and ready to scale! 📂
