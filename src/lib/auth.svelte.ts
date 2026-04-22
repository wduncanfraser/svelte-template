const baseUrl = (import.meta.env.PUBLIC_API_BASE_URL as string | undefined) ?? '/api/v1';

let authenticated = $state<boolean | null>(null);

export function getAuthState() {
	return {
		get authenticated() {
			return authenticated;
		}
	};
}

export async function checkAuth(): Promise<boolean> {
	const response = await fetch(`${baseUrl}/todos?pageSize=1`, { redirect: 'manual' });
	const isAuthenticated = response.type !== 'opaqueredirect' && response.ok;
	authenticated = isAuthenticated;
	return isAuthenticated;
}
