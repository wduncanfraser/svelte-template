<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { checkAuth, getAuthState } from '$lib/auth.svelte';

	const { children } = $props();

	const auth = getAuthState();

	onMount(async () => {
		await checkAuth();
	});
</script>

{#if auth.authenticated === null}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<p class="text-gray-500">Loading…</p>
	</div>
{:else if auth.authenticated === false}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold text-gray-900">Todo App</h1>
			<p class="mb-6 text-gray-600">Sign in to manage your todos.</p>
			<a
				href="/login"
				rel="external"
				class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
			>
				Login with Discord
			</a>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
		<header class="border-b border-gray-200 bg-white shadow-sm">
			<div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
				<h1 class="text-xl font-bold text-gray-900">Todo App</h1>
				<a href="/logout" rel="external" class="text-sm text-gray-500 hover:text-gray-700">Logout</a
				>
			</div>
		</header>
		<main class="mx-auto max-w-2xl px-4 py-8">
			{@render children()}
		</main>
	</div>
{/if}
