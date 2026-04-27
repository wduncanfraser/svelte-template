import { expect, test } from '@playwright/test';
import { mockAuthenticatedApi, mockUnauthenticatedApi } from './fixtures';

test('shows login screen when unauthenticated', async ({ page }) => {
	await mockUnauthenticatedApi(page);
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Login with Discord' })).toBeVisible();
});

test('shows todo lists when authenticated', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/');
	await expect(page.getByText('Groceries')).toBeVisible();
	await expect(page.getByText('Work tasks')).toBeVisible();
});

test('can create a todo list', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/');
	await page.getByPlaceholder('New list name…').fill('My new list');
	await page.getByRole('button', { name: 'Add' }).click();
	await expect(page.getByText('Groceries')).toBeVisible();
});

test('can navigate to a todo list', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/');
	await page.getByRole('link', { name: 'Groceries' }).click();
	await expect(page).toHaveURL(/\/lists\/list-1/);
	await expect(page.getByText('Buy groceries')).toBeVisible();
});

test('shows all todos view', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/todos');
	await expect(page.getByText('Buy groceries')).toBeVisible();
	await expect(page.getByText('Walk the dog')).toBeVisible();
});

test('nav shows active link for lists page', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/');
	const myListsLink = page.getByRole('link', { name: 'My Lists' });
	await expect(myListsLink).toHaveClass(/text-indigo-600/);
});

test('nav shows active link for all todos page', async ({ page }) => {
	await mockAuthenticatedApi(page);
	await page.goto('/todos');
	const allTodosLink = page.getByRole('link', { name: 'All Todos' });
	await expect(allTodosLink).toHaveClass(/text-indigo-600/);
});
