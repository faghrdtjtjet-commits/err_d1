<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { theme } from '$lib/theme';
	import '../app.css';

	export const user = writable<any>(null);

	onMount(async () => {
		// Initialize theme
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
		if (savedTheme) {
			theme.set(savedTheme);
		}
		
		try {
			const res = await fetch('/api/auth/me');
			if (res.ok) {
				const data = await res.json();
				user.set(data.user);
			}
		} catch (e) {
			console.log('Not authenticated');
		}
	});
</script>

<slot />
