import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: 'src/lib/contracts/todo.yaml',
	output: {
		path: 'src/lib/generated/todo',
		postProcess: ['prettier']
	},
	plugins: ['@hey-api/client-fetch']
});
