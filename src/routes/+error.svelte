<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="py-12 text-center">
	<h2 class="mb-2 text-2xl font-bold text-gray-900">{$page.status}</h2>
	<p class="text-gray-600">{$page.error?.message ?? 'An unexpected error occurred.'}</p>
</div>
