import { cleanup, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import TodoItem from './TodoItem.svelte';

const baseTodo = {
	id: '1',
	todoListId: 'list-1',
	name: 'Cook dinner',
	completed: false,
	createdBy: 'user-1',
	createdAt: '2024-01-15T10:00:00Z',
	updatedAt: '2024-01-16T12:30:00Z'
};

const completedTodo = {
	...baseTodo,
	completed: true,
	completedAt: '2024-01-17T08:45:00Z'
};

describe('TodoItem', () => {
	afterEach(() => cleanup());

	it('renders the todo name', () => {
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		expect(screen.getByText('Cook dinner')).toBeInTheDocument();
	});

	it('renders a checked checkbox for completed todos', () => {
		render(TodoItem, { todo: completedTodo, ontoggle: () => {}, ondelete: () => {} });
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('renders an unchecked checkbox for incomplete todos', () => {
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('hides the detail panel by default', () => {
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		expect(screen.queryByText('Created')).not.toBeInTheDocument();
	});

	it('shows the detail panel when the name is clicked', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByText('Cook dinner'));
		expect(screen.getByText('Created')).toBeInTheDocument();
		expect(screen.getByText('Updated')).toBeInTheDocument();
	});

	it('shows the detail panel when the chevron is clicked', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByRole('button', { name: 'Expand details' }));
		expect(screen.getByText('Created')).toBeInTheDocument();
	});

	it('collapses the detail panel on second click', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByText('Cook dinner'));
		await user.click(screen.getByText('Cook dinner'));
		expect(screen.queryByText('Created')).not.toBeInTheDocument();
	});

	it('shows completedAt in the detail panel for completed todos', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: completedTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByText('Cook dinner'));
		expect(screen.getByText('Completed')).toBeInTheDocument();
	});

	it('omits completedAt from the detail panel for incomplete todos', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByText('Cook dinner'));
		expect(screen.queryByText('Completed')).not.toBeInTheDocument();
	});

	it('shows a list link in the detail panel', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByText('Cook dinner'));
		const link = screen.getByRole('link', { name: 'list-1' });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/lists/list-1');
	});

	it('shows createdBy in the detail panel', async () => {
		const user = userEvent.setup();
		render(TodoItem, { todo: baseTodo, ontoggle: () => {}, ondelete: () => {} });
		await user.click(screen.getByText('Cook dinner'));
		expect(screen.getByText('user-1')).toBeInTheDocument();
	});
});
