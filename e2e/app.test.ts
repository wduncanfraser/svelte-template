import { expect, test } from '@playwright/test';
import { mockAuthenticatedApi, mockUnauthenticatedApi } from './fixtures';

test('shows login screen when unauthenticated', async ({ page }) => {
	await mockUnauthenticatedApi(page);
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Login with Discord' })).toBeVisible();
});

test('shows todo list when authenticated', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/');
	await expect(page.getByText('Buy groceries')).toBeVisible();
	await expect(page.getByText('Walk the dog')).toBeVisible();
});

test('can create a todo', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/');
	await page.getByPlaceholder('Add a new todo…').fill('Write tests');
	await page.getByRole('button', { name: 'Add' }).click();
	await expect(page.getByText('Buy groceries')).toBeVisible();
});
