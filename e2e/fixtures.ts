import type { Page } from '@playwright/test';

export const mockTodoLists = [
	{
		id: 'list-1',
		name: 'Groceries',
		description: 'Weekly shopping',
		createdBy: 'user-1',
		createdAt: '2024-01-14T08:00:00Z',
		updatedAt: '2024-01-14T08:00:00Z'
	},
	{
		id: 'list-2',
		name: 'Work tasks',
		description: null,
		createdBy: 'user-1',
		createdAt: '2024-01-15T09:00:00Z',
		updatedAt: '2024-01-15T09:00:00Z'
	}
];

export const mockTodos = [
	{
		id: '1',
		todoListId: 'list-1',
		name: 'Buy groceries',
		completed: false,
		createdBy: 'user-1',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: '2',
		todoListId: 'list-1',
		name: 'Walk the dog',
		completed: true,
		createdBy: 'user-1',
		createdAt: '2024-01-14T09:00:00Z',
		updatedAt: '2024-01-14T10:00:00Z',
		completedAt: '2024-01-14T10:00:00Z'
	}
];

export async function mockAuthenticatedApi(page: Page) {
	await page.route('/api/v1/**', (route) => {
		const url = route.request().url();
		const method = route.request().method();

		if (method === 'DELETE') {
			return route.fulfill({ status: 204 });
		}

		if (method === 'POST') {
			if (url.includes('/todo-lists') && !url.includes('/todos')) {
				return route.fulfill({
					status: 201,
					contentType: 'application/json',
					body: JSON.stringify({
						id: 'list-3',
						name: 'New list',
						description: null,
						createdBy: 'user-1',
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					})
				});
			}
			return route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({
					id: '3',
					todoListId: 'list-1',
					name: 'New todo',
					completed: false,
					createdBy: 'user-1',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				})
			});
		}

		if (url.includes('/todo-lists') && !url.match(/\/todo-lists\/[^/]+\/todos/)) {
			if (url.match(/\/todo-lists\/[^/]+$/)) {
				return route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify(mockTodoLists[0])
				});
			}
			return route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ data: mockTodoLists, pagination: { totalPages: 1 } })
			});
		}

		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ data: mockTodos, pagination: { totalPages: 1 } })
		});
	});
}

export async function mockUnauthenticatedApi(page: Page) {
	await page.route('/api/v1/**', (route) => route.fulfill({ status: 401 }));
}
