<script lang="ts">
	import { createTodoList, deleteTodoList, listTodoLists, updateTodoList } from '$lib/api/client';
	import type { TodoListResponse } from '$lib/api/client';
	import TodoListCard from './TodoListCard.svelte';

	let lists = $state<TodoListResponse[]>([]);
	let page = $state(1);
	let totalPages = $state(1);
	let newListName = $state('');
	let newListDescription = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchLists(currentPage: number = page) {
		loading = true;
		error = null;
		const result = await listTodoLists({ query: { page: currentPage } });
		if (result.data) {
			lists = result.data.data;
			totalPages = result.data.pagination.totalPages;
		} else {
			error = 'Failed to load lists.';
		}
		loading = false;
	}

	async function handleCreate(event: SubmitEvent) {
		event.preventDefault();
		const name = newListName.trim();
		if (!name) return;
		const description = newListDescription.trim() || null;
		const result = await createTodoList({ body: { name, description } });
		if (result.data) {
			newListName = '';
			newListDescription = '';
			await fetchLists();
		}
	}

	async function handleEdit(updated: TodoListResponse) {
		await updateTodoList({
			path: { 'list-id': updated.id },
			body: { name: updated.name, description: updated.description }
		});
		await fetchLists();
	}

	async function handleDelete(id: string) {
		await deleteTodoList({ path: { 'list-id': id } });
		await fetchLists();
	}

	$effect(() => {
		fetchLists(page);
	});
</script>

<div class="space-y-6">
	<form onsubmit={handleCreate} class="space-y-2">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={newListName}
				placeholder="New list name…"
				class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
			/>
			<button
				type="submit"
				class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
				disabled={!newListName.trim()}
			>
				Add
			</button>
		</div>
		<input
			type="text"
			bind:value={newListDescription}
			placeholder="Description (optional)"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
		/>
	</form>

	{#if loading}
		<p class="text-center text-sm text-gray-400">Loading…</p>
	{:else if error}
		<p class="text-center text-sm text-red-500">{error}</p>
	{:else if lists.length === 0}
		<p class="text-center text-sm text-gray-400">No lists yet.</p>
	{:else}
		<ul class="space-y-2">
			{#each lists as list (list.id)}
				<TodoListCard {list} onedit={handleEdit} ondelete={handleDelete} />
			{/each}
		</ul>
	{/if}

	{#if totalPages > 1}
		<div class="flex items-center justify-center gap-4">
			<button
				onclick={() => (page -= 1)}
				disabled={page === 1}
				class="rounded-md px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40"
			>
				← Prev
			</button>
			<span class="text-sm text-gray-500">Page {page} of {totalPages}</span>
			<button
				onclick={() => (page += 1)}
				disabled={page === totalPages}
				class="rounded-md px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40"
			>
				Next →
			</button>
		</div>
	{/if}
</div>
