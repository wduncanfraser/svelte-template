<script lang="ts">
	import { resolve } from '$app/paths';
	import type { TodoListResponse } from '$lib/api/client';

	interface Props {
		list: TodoListResponse;
		onedit: (list: TodoListResponse) => void;
		ondelete: (id: string) => void;
	}

	const { list, onedit, ondelete }: Props = $props();

	let editing = $state(false);
	let editName = $state('');
	let editDescription = $state('');

	function startEdit() {
		editName = list.name;
		editDescription = list.description ?? '';
		editing = true;
	}

	function cancelEdit() {
		editing = false;
	}

	function submitEdit(event: SubmitEvent) {
		event.preventDefault();
		const name = editName.trim();
		if (!name) return;
		onedit({ ...list, name, description: editDescription.trim() || null });
		editing = false;
	}
</script>

<li class="rounded-lg border border-gray-200 bg-white shadow-sm">
	{#if editing}
		<form onsubmit={submitEdit} class="flex items-center gap-2 px-4 py-3">
			<div class="flex flex-1 flex-col gap-1">
				<input
					type="text"
					bind:value={editName}
					placeholder="List name"
					class="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				/>
				<input
					type="text"
					bind:value={editDescription}
					placeholder="Description (optional)"
					class="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				/>
			</div>
			<button
				type="submit"
				disabled={!editName.trim()}
				class="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
			>
				Save
			</button>
			<button
				type="button"
				onclick={cancelEdit}
				class="rounded-md px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"
			>
				Cancel
			</button>
		</form>
	{:else}
		<div class="flex items-center gap-3 px-4 py-3">
			<div class="flex-1 min-w-0">
				<a
					href={resolve('/lists/[listId]', { listId: list.id })}
					class="block text-sm font-medium text-indigo-600 hover:underline truncate"
				>
					{list.name}
				</a>
				{#if list.description}
					<p class="mt-0.5 truncate text-xs text-gray-500">{list.description}</p>
				{/if}
			</div>
			<button
				onclick={startEdit}
				class="text-gray-400 hover:text-gray-600 text-sm"
				aria-label="Edit list"
			>
				✎
			</button>
			<button
				onclick={() => ondelete(list.id)}
				class="text-gray-400 hover:text-red-500"
				aria-label="Delete list"
			>
				&times;
			</button>
		</div>
	{/if}
</li>
