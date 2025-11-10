<script lang="ts">
	import VideoCard from './VideoCard.svelte';

	export let videos: any[] = [];
	export let compact = false;
</script>

<div class="video-grid" class:compact>
	{#each videos as video (video.id)}
		<VideoCard {video} {compact} />
	{/each}
</div>

<style>
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 24px 16px;
		padding: 24px 0;
	}

	.video-grid.compact {
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (max-width: 1200px) {
		.video-grid {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 20px 12px;
		}
	}

	@media (max-width: 768px) {
		.video-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 16px;
			padding: 16px 0;
		}
	}

	@media (max-width: 600px) {
		.video-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 12px;
		}
	}

	@media (max-width: 480px) {
		.video-grid {
			grid-template-columns: 1fr;
			gap: 12px;
			padding: 12px 0;
		}
	}
</style>
