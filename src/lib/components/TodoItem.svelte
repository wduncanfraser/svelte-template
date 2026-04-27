<script lang="ts">
	import { resolve } from '$app/paths';
	import type { TodoResponse } from '$lib/api/client';

	interface Props {
		todo: TodoResponse;
		ontoggle: (todo: TodoResponse) => void;
		ondelete: (id: string) => void;
	}

	const { todo, ontoggle, ondelete }: Props = $props();

	let expanded = $state(false);

	function formatDate(iso: string): string {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(iso));
	}
</script>

<li class="rounded-lg border border-gray-200 bg-white shadow-sm">
	<div class="flex items-center gap-3 px-4 py-3">
		<input
			type="checkbox"
			checked={todo.completed}
			onchange={() => ontoggle(todo)}
			class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
		/>
		<button
			onclick={() => (expanded = !expanded)}
			class="flex-1 text-left text-sm {todo.completed
				? 'text-gray-400 line-through'
				: 'text-gray-900'}"
		>
			{todo.name}
		</button>
		<button
			onclick={() => (expanded = !expanded)}
			class="text-gray-400 hover:text-gray-600"
			aria-label={expanded ? 'Collapse details' : 'Expand details'}
		>
			{expanded ? '▴' : '▾'}
		</button>
		<button
			onclick={() => ondelete(todo.id)}
			class="text-gray-400 hover:text-red-500"
			aria-label="Delete todo"
		>
			&times;
		</button>
	</div>
	{#if expanded}
		<div class="border-t border-gray-100 px-4 py-3">
			<dl class="space-y-1 text-xs text-gray-500">
				<div class="flex gap-2">
					<dt class="font-medium">List</dt>
					<dd>
						<a
							href={resolve('/lists/[listId]', { listId: todo.todoListId })}
							class="text-indigo-600 hover:underline">{todo.todoListId}</a
						>
					</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">Created by</dt>
					<dd>{todo.createdBy}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">Created</dt>
					<dd>{formatDate(todo.createdAt)}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">Updated</dt>
					<dd>{formatDate(todo.updatedAt)}</dd>
				</div>
				{#if todo.completedAt}
					<div class="flex gap-2">
						<dt class="font-medium">Completed</dt>
						<dd>{formatDate(todo.completedAt)}</dd>
					</div>
				{/if}
			</dl>
		</div>
	{/if}
</li>
