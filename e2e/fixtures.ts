import type { Page } from '@playwright/test';

export const mockTodos = [
	{
		id: '1',
		name: 'Buy groceries',
		completed: false,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: '2',
		name: 'Walk the dog',
		completed: true,
		createdAt: '2024-01-14T09:00:00Z',
		updatedAt: '2024-01-14T10:00:00Z',
		completedAt: '2024-01-14T10:00:00Z'
	}
];

export async function mockAuthenticatedApi(page: Page) {
	await page.route('/api/v1/**', (route) => {
		if (route.request().method() === 'POST') {
			route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({
					id: '3',
					name: 'New todo',
					completed: false,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				})
			});
		} else {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ data: mockTodos, pagination: { totalPages: 1 } })
			});
		}
	});
}

export async function mockUnauthenticatedApi(page: Page) {
	await page.route('/api/v1/**', (route) => route.fulfill({ status: 401 }));
}
