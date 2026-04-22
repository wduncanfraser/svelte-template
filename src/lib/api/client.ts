import { client } from '$lib/generated/todo/client.gen';

const baseUrl = (import.meta.env.PUBLIC_API_BASE_URL as string | undefined) ?? '/api/v1';

client.setConfig({ baseUrl, redirect: 'manual' });

export { client };
export * from '$lib/generated/todo/sdk.gen';
export * from '$lib/generated/todo/types.gen';
