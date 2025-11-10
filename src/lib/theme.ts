import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
	if (!browser) return 'dark';
	
	const stored = localStorage.getItem('theme') as Theme;
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	
	// Default to dark theme
	return 'dark';
}

function createThemeStore() {
	const { subscribe, set } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		set: (value: Theme) => {
			if (browser) {
				localStorage.setItem('theme', value);
				document.documentElement.setAttribute('data-theme', value);
			}
			set(value);
		},
		toggle: () => {
			const current = browser ? (localStorage.getItem('theme') as Theme) || 'dark' : 'dark';
			const next: Theme = current === 'dark' ? 'light' : 'dark';
			if (browser) {
				localStorage.setItem('theme', next);
				document.documentElement.setAttribute('data-theme', next);
			}
			set(next);
		}
	};
}

export const theme = createThemeStore();

// Initialize theme on load
if (browser) {
	const initialTheme = getInitialTheme();
	document.documentElement.setAttribute('data-theme', initialTheme);
}
