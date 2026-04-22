<script lang="ts">
	import { createTodo, deleteTodo, listTodos, updateTodo } from '$lib/api/client';
	import type { TodoResponse } from '$lib/api/client';
	import TodoItem from './TodoItem.svelte';

	type Filter = 'all' | 'active' | 'completed';

	let todos = $state<TodoResponse[]>([]);
	let filter = $state<Filter>('all');
	let page = $state(1);
	let totalPages = $state(1);
	let newTodoName = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);

	const filters: { label: string; value: Filter }[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Active', value: 'active' },
		{ label: 'Completed', value: 'completed' }
	];

	async function fetchTodos(currentFilter: Filter = filter, currentPage: number = page) {
		loading = true;
		error = null;
		const completed = currentFilter === 'all' ? undefined : currentFilter === 'completed';
		const result = await listTodos({ query: { completed, page: currentPage } });
		if (result.data) {
			todos = result.data.data;
			totalPages = result.data.pagination.totalPages;
		} else {
			error = 'Failed to load todos.';
		}
		loading = false;
	}

	async function handleCreate(event: SubmitEvent) {
		event.preventDefault();
		const name = newTodoName.trim();
		if (!name) return;
		const result = await createTodo({ body: { name } });
		if (result.data) {
			newTodoName = '';
			await fetchTodos();
		}
	}

	async function handleToggle(todo: TodoResponse) {
		await updateTodo({
			path: { 'todo-id': todo.id },
			body: { name: todo.name, completed: !todo.completed }
		});
		await fetchTodos();
	}

	async function handleDelete(id: string) {
		await deleteTodo({ path: { 'todo-id': id } });
		await fetchTodos();
	}

	$effect(() => {
		fetchTodos(filter, page);
	});
</script>

<div class="space-y-6">
	<form onsubmit={handleCreate} class="flex gap-2">
		<input
			type="text"
			bind:value={newTodoName}
			placeholder="Add a new todo…"
			class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
		/>
		<button
			type="submit"
			class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
			disabled={!newTodoName.trim()}
		>
			Add
		</button>
	</form>

	<div class="flex gap-2">
		{#each filters as f}
			<button
				onclick={() => {
					page = 1;
					filter = f.value;
				}}
				class="rounded-md px-3 py-1 text-sm font-medium {filter === f.value
					? 'bg-indigo-100 text-indigo-700'
					: 'text-gray-500 hover:text-gray-700'}"
			>
				{f.label}
			</button>
		{/each}
	</div>

	{#if loading}
		<p class="text-center text-sm text-gray-400">Loading…</p>
	{:else if error}
		<p class="text-center text-sm text-red-500">{error}</p>
	{:else if todos.length === 0}
		<p class="text-center text-sm text-gray-400">No todos yet.</p>
	{:else}
		<ul class="space-y-2">
			{#each todos as todo (todo.id)}
				<TodoItem {todo} ontoggle={handleToggle} ondelete={handleDelete} />
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
