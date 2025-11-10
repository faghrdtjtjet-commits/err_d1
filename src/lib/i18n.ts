import { writable } from 'svelte/store';

export type Language = 'en' | 'ru';

export const translations = {
	en: {
		// Header
		home: 'Home',
		trending: 'Trending',
		subscriptions: 'Subscriptions',
		history: 'History',
		liked: 'Liked Videos',
		myVideos: 'My Videos',
		watchLater: 'Watch Later',
		upload: 'Upload',
		login: 'Sign In',
		logout: 'Sign Out',
		settings: 'Settings',
		studio: 'Creator Studio',
		myChannel: 'My Channel',
		
		// Video
		views: 'views',
		subscribers: 'subscribers',
		subscribe: 'Subscribe',
		subscribed: 'Subscribed',
		like: 'Like',
		dislike: 'Dislike',
		share: 'Share',
		analytics: 'Analytics',
		editVideo: 'Edit Video',
		
		// Comments
		comments: 'Comments',
		addComment: 'Add a comment...',
		comment: 'Comment',
		reply: 'Reply',
		addReply: 'Add a reply...',
		cancel: 'Cancel',
		pinnedBy: 'Pinned by author',
		heartComment: 'Heart Comment',
		removeHeart: 'Remove Heart',
		pinComment: 'Pin Comment',
		unpin: 'Unpin',
		
		// Upload
		uploadVideo: 'Upload Video',
		dragDrop: 'Drag and drop video file here',
		selectFile: 'Select File',
		title: 'Title',
		description: 'Description',
		thumbnail: 'Thumbnail',
		uploading: 'Uploading...',
		
		// Settings
		profileSettings: 'Profile Settings',
		channelAppearance: 'Channel Appearance',
		username: 'Username',
		email: 'Email',
		avatarImage: 'Avatar Image',
		bannerImage: 'Banner Image',
		saveChanges: 'Save Changes',
		currentAvatar: 'Current avatar',
		currentBanner: 'Current banner',
		newAvatar: 'New avatar (not saved yet)',
		newBanner: 'New banner (not saved yet)',
		
		// Studio
		dashboard: 'Dashboard',
		content: 'Content',
		totalViews: 'Total Views',
		videos: 'Videos',
		likes: 'Likes',
		latestVideos: 'Latest Videos',
		noVideos: 'No videos yet',
		uploadFirst: 'Upload your first video',
		edit: 'Edit',
		delete: 'Delete',
		deleteConfirm: 'Delete this video?',
		
		// Auth
		signIn: 'Sign In',
		signUp: 'Sign Up',
		register: 'Register',
		password: 'Password',
		dontHaveAccount: "Don't have an account?",
		alreadyHaveAccount: 'Already have an account?',
		
		// Common
		loading: 'Loading...',
		save: 'Save',
		search: 'Search',
		noResults: 'No results found',
		error: 'Error',
		success: 'Success',
		channelNotFound: 'Channel not found',
		videoNotFound: 'Video not found',
		
		// Time
		justNow: 'just now',
		minutesAgo: 'minutes ago',
		hoursAgo: 'hours ago',
		daysAgo: 'days ago',
		weeksAgo: 'weeks ago',
		monthsAgo: 'months ago',
		yearsAgo: 'years ago',
		
		// Sidebar
		library: 'Library',
		
		// Theme
		darkTheme: 'Dark Theme',
		lightTheme: 'Light Theme',
		
		// Studio Analytics
		overview: 'Overview',
		performance: 'Performance',
		
		// Video Stats
		video: 'Video',
		views24h: '24h Views',
		totalLikes: 'Total Likes',
		avgViewDuration: 'Avg. View Duration',
		
		// Misc
		ago: 'ago',
		minute: 'minute',
		minutes: 'minutes',
		hour: 'hour',
		hours: 'hours',
		day: 'day',
		days: 'days',
		week: 'week',
		weeks: 'weeks',
		month: 'month',
		months: 'months',
		year: 'year',
		years: 'years',
		
		// Pages
		searchResultsFor: 'Search results for',
		searching: 'Searching...',
		noVideosFound: 'No videos found',
		noTrendingVideos: 'No trending videos yet',
		noWatchHistory: 'No watch history yet. Start watching videos!',
		noWatchLater: 'No videos saved for later',
		noLikedVideos: 'No liked videos yet. Start liking videos you enjoy!',
		yourVideos: 'Your Videos',
		youHaventUploaded: "You haven't uploaded any videos yet.",
		noCommentsYet: 'No comments yet',
		on: 'On',
		subscribers_other: 'subscribers',
		videos_other: 'videos',
	},
	ru: {
		// Header
		home: 'Главная',
		trending: 'В тренде',
		subscriptions: 'Подписки',
		history: 'История',
		liked: 'Понравившиеся',
		myVideos: 'Мои видео',
		watchLater: 'Смотреть позже',
		upload: 'Загрузить',
		login: 'Войти',
		logout: 'Выйти',
		settings: 'Настройки',
		studio: 'Творческая студия',
		myChannel: 'Мой канал',
		
		// Video
		views: 'просмотров',
		subscribers: 'подписчиков',
		subscribe: 'Подписаться',
		subscribed: 'Вы подписаны',
		like: 'Нравится',
		dislike: 'Не нравится',
		share: 'Поделиться',
		analytics: 'Аналитика',
		editVideo: 'Редактировать',
		
		// Comments
		comments: 'Комментарии',
		addComment: 'Введите комментарий...',
		comment: 'Комментировать',
		reply: 'Ответить',
		addReply: 'Введите ответ...',
		cancel: 'Отмена',
		pinnedBy: 'Закреплено автором',
		heartComment: 'Отметить сердечком',
		removeHeart: 'Убрать сердечко',
		pinComment: 'Закрепить',
		unpin: 'Открепить',
		
		// Upload
		uploadVideo: 'Загрузка видео',
		dragDrop: 'Перетащите видеофайл сюда',
		selectFile: 'Выбрать файл',
		title: 'Название',
		description: 'Описание',
		thumbnail: 'Превью',
		uploading: 'Загрузка...',
		
		// Settings
		profileSettings: 'Настройки профиля',
		channelAppearance: 'Оформление канала',
		username: 'Имя пользователя',
		email: 'Email',
		avatarImage: 'Аватар',
		bannerImage: 'Баннер',
		saveChanges: 'Сохранить изменения',
		currentAvatar: 'Текущий аватар',
		currentBanner: 'Текущий баннер',
		newAvatar: 'Новый аватар (не сохранён)',
		newBanner: 'Новый баннер (не сохранён)',
		
		// Studio
		dashboard: 'Панель управления',
		content: 'Контент',
		totalViews: 'Всего просмотров',
		videos: 'Видео',
		likes: 'Лайки',
		latestVideos: 'Последние видео',
		noVideos: 'Нет видео',
		uploadFirst: 'Загрузите первое видео',
		edit: 'Изменить',
		delete: 'Удалить',
		deleteConfirm: 'Удалить это видео?',
		
		// Auth
		signIn: 'Войти',
		signUp: 'Регистрация',
		register: 'Зарегистрироваться',
		password: 'Пароль',
		dontHaveAccount: 'Нет аккаунта?',
		alreadyHaveAccount: 'Уже есть аккаунт?',
		
		// Common
		loading: 'Загрузка...',
		save: 'Сохранить',
		search: 'Поиск',
		noResults: 'Ничего не найдено',
		error: 'Ошибка',
		success: 'Успешно',
		channelNotFound: 'Канал не найден',
		videoNotFound: 'Видео не найдено',
		
		// Time
		justNow: 'только что',
		minutesAgo: 'минут назад',
		hoursAgo: 'часов назад',
		daysAgo: 'дней назад',
		weeksAgo: 'недель назад',
		monthsAgo: 'месяцев назад',
		yearsAgo: 'лет назад',
		
		// Sidebar
		library: 'Библиотека',
		
		// Theme
		darkTheme: 'Темная тема',
		lightTheme: 'Светлая тема',
		
		// Studio Analytics
		overview: 'Обзор',
		performance: 'Производительность',
		
		// Video Stats
		video: 'Видео',
		views24h: 'Просмотры за 24ч',
		totalLikes: 'Всего лайков',
		avgViewDuration: 'Ср. длительность',
		
		// Misc
		ago: 'назад',
		minute: 'минута',
		minutes: 'минуты',
		hour: 'час',
		hours: 'часа',
		day: 'день',
		days: 'дня',
		week: 'неделя',
		weeks: 'недели',
		month: 'месяц',
		months: 'месяца',
		year: 'год',
		years: 'года',
		
		// Pages
		searchResultsFor: 'Результаты поиска для',
		searching: 'Поиск...',
		noVideosFound: 'Видео не найдено',
		noTrendingVideos: 'Пока нет популярных видео',
		noWatchHistory: 'История просмотра пуста. Начните смотреть видео!',
		noWatchLater: 'Нет видео, сохраненных для просмотра позже',
		noLikedVideos: 'Пока нет понравившихся видео. Начните ставить лайки!',
		yourVideos: 'Ваши видео',
		youHaventUploaded: 'Вы еще не загрузили ни одного видео.',
		noCommentsYet: 'Пока нет комментариев',
		on: 'К',
		subscribers_other: 'подписчиков',
		videos_other: 'видео',
	}
};

export function detectBrowserLanguage(): Language {
	if (typeof navigator === 'undefined') return 'en';
	
	const lang = navigator.language.toLowerCase();
	
	if (lang.startsWith('ru')) return 'ru';
	return 'en';
}

// Create language store with browser detection
function createLanguageStore() {
	// Try to get from localStorage first, then detect browser language
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null;
	const initial = (stored as Language) || detectBrowserLanguage();
	
	const { subscribe, set } = writable<Language>(initial);
	
	return {
		subscribe,
		set: (lang: Language) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('language', lang);
			}
			set(lang);
		}
	};
}

export const language = createLanguageStore();

// Helper function to get translation
export function t(key: keyof typeof translations.en, lang: Language = 'en'): string {
	return translations[lang][key] || translations.en[key] || key;
}
