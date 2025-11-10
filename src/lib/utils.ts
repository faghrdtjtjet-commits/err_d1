export function formatViews(views: number): string {
	if (views >= 1000000) {
		return (views / 1000000).toFixed(1) + 'M';
	}
	if (views >= 1000) {
		return (views / 1000).toFixed(1) + 'K';
	}
	return views.toString();
}

export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(date: string, lang: 'en' | 'ru' = 'en'): string {
	const now = new Date();
	// Parse the date string properly - handle both UTC and local timestamps
	let past: Date;
	
	// If the date string doesn't include timezone info, treat it as UTC
	if (!date.includes('Z') && !date.includes('+') && !date.includes('-', 10)) {
		past = new Date(date + 'Z'); // Add Z to indicate UTC
	} else {
		past = new Date(date);
	}
	
	// Calculate difference in seconds
	const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	// Handle edge cases
	if (diffInSeconds < 0) {
		// If time is in the future, it's probably just now
		return lang === 'ru' ? 'только что' : 'just now';
	}
	
	if (diffInSeconds < 60) {
		return lang === 'ru' ? 'только что' : 'just now';
	}
	
	const minutes = Math.floor(diffInSeconds / 60);
	if (minutes < 60) {
		if (lang === 'ru') {
			return `${minutes} ${getRussianMinutesWord(minutes)} назад`;
		}
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
	}
	
	const hours = Math.floor(diffInSeconds / 3600);
	if (hours < 24) {
		if (lang === 'ru') {
			return `${hours} ${getRussianHoursWord(hours)} назад`;
		}
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
	}
	
	const days = Math.floor(diffInSeconds / 86400);
	if (days < 7) {
		if (lang === 'ru') {
			return `${days} ${getRussianDaysWord(days)} назад`;
		}
		return `${days} ${days === 1 ? 'day' : 'days'} ago`;
	}
	
	const weeks = Math.floor(days / 7);
	if (weeks < 4) {
		if (lang === 'ru') {
			return `${weeks} ${getRussianWeeksWord(weeks)} назад`;
		}
		return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
	}
	
	const months = Math.floor(days / 30);
	if (months < 12) {
		if (lang === 'ru') {
			return `${months} ${getRussianMonthsWord(months)} назад`;
		}
		return `${months} ${months === 1 ? 'month' : 'months'} ago`;
	}
	
	const years = Math.floor(days / 365);
	if (lang === 'ru') {
		return `${years} ${getRussianYearsWord(years)} назад`;
	}
	return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

function getRussianMinutesWord(n: number): string {
	if (n % 10 === 1 && n % 100 !== 11) return 'минуту';
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'минуты';
	return 'минут';
}

function getRussianHoursWord(n: number): string {
	if (n % 10 === 1 && n % 100 !== 11) return 'час';
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'часа';
	return 'часов';
}

function getRussianDaysWord(n: number): string {
	if (n % 10 === 1 && n % 100 !== 11) return 'день';
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дня';
	return 'дней';
}

function getRussianWeeksWord(n: number): string {
	if (n % 10 === 1 && n % 100 !== 11) return 'неделю';
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'недели';
	return 'недель';
}

function getRussianMonthsWord(n: number): string {
	if (n % 10 === 1 && n % 100 !== 11) return 'месяц';
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'месяца';
	return 'месяцев';
}

function getRussianYearsWord(n: number): string {
	if (n % 10 === 1 && n % 100 !== 11) return 'год';
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'года';
	return 'лет';
}

export function sanitizeFilename(filename: string): string {
	return filename.replace(/[^a-z0-9._-]/gi, '_').toLowerCase();
}
