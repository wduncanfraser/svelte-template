import { cleanup, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TodoListCard from './TodoListCard.svelte';

const baseList = {
	id: 'list-1',
	name: 'Shopping',
	description: 'Weekly grocery shopping',
	createdBy: 'user-1',
	createdAt: '2024-01-15T10:00:00Z',
	updatedAt: '2024-01-16T12:30:00Z'
};

const listWithoutDescription = {
	...baseList,
	id: 'list-2',
	description: null
};

describe('TodoListCard', () => {
	afterEach(() => cleanup());

	it('renders the list name', () => {
		render(TodoListCard, { list: baseList, onedit: () => {}, ondelete: () => {} });
		expect(screen.getByText('Shopping')).toBeInTheDocument();
	});

	it('renders a link to the list detail page', () => {
		render(TodoListCard, { list: baseList, onedit: () => {}, ondelete: () => {} });
		const link = screen.getByRole('link', { name: 'Shopping' });
		expect(link).toHaveAttribute('href', '/lists/list-1');
	});

	it('renders the description when present', () => {
		render(TodoListCard, { list: baseList, onedit: () => {}, ondelete: () => {} });
		expect(screen.getByText('Weekly grocery shopping')).toBeInTheDocument();
	});

	it('omits the description when absent', () => {
		render(TodoListCard, { list: listWithoutDescription, onedit: () => {}, ondelete: () => {} });
		expect(screen.queryByText('Weekly grocery shopping')).not.toBeInTheDocument();
	});

	it('calls ondelete with the list id when the delete button is clicked', async () => {
		const user = userEvent.setup();
		const ondelete = vi.fn();
		render(TodoListCard, { list: baseList, onedit: () => {}, ondelete });
		await user.click(screen.getByRole('button', { name: 'Delete list' }));
		expect(ondelete).toHaveBeenCalledWith('list-1');
	});

	it('shows an edit form when the edit button is clicked', async () => {
		const user = userEvent.setup();
		render(TodoListCard, { list: baseList, onedit: () => {}, ondelete: () => {} });
		await user.click(screen.getByRole('button', { name: 'Edit list' }));
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
	});

	it('calls onedit with updated list on save', async () => {
		const user = userEvent.setup();
		const onedit = vi.fn();
		render(TodoListCard, { list: baseList, onedit, ondelete: () => {} });
		await user.click(screen.getByRole('button', { name: 'Edit list' }));
		const nameInput = screen.getByPlaceholderText('List name');
		await user.clear(nameInput);
		await user.type(nameInput, 'Errands');
		await user.click(screen.getByRole('button', { name: 'Save' }));
		expect(onedit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Errands' }));
	});

	it('cancels editing without calling onedit', async () => {
		const user = userEvent.setup();
		const onedit = vi.fn();
		render(TodoListCard, { list: baseList, onedit, ondelete: () => {} });
		await user.click(screen.getByRole('button', { name: 'Edit list' }));
		await user.click(screen.getByRole('button', { name: 'Cancel' }));
		expect(onedit).not.toHaveBeenCalled();
		expect(screen.getByText('Shopping')).toBeInTheDocument();
	});
});
