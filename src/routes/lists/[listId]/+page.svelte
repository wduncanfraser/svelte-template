<script lang="ts">
	import { page } from '$app/stores';
	import { getTodoList } from '$lib/api/client';
	import type { TodoListResponse } from '$lib/api/client';
	import TodoItemList from '$lib/components/TodoItemList.svelte';

	let listInfo = $state<TodoListResponse | null>(null);

	$effect(() => {
		const listId = $page.params.listId;
		if (!listId) return;
		getTodoList({ path: { 'list-id': listId } }).then((result) => {
			if (result.data) listInfo = result.data;
		});
	});
</script>

{#if listInfo}
	<div class="mb-6">
		<h2 class="text-lg font-semibold text-gray-900">{listInfo.name}</h2>
		{#if listInfo.description}
			<p class="mt-1 text-sm text-gray-500">{listInfo.description}</p>
		{/if}
	</div>
{/if}

{#if $page.params.listId}
	<TodoItemList listId={$page.params.listId} />
{/if}
