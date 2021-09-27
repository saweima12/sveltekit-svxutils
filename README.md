# SvxUtils

An easily & useful content provider for SvelteKit. use [MDsveX](https://github.com/pngwn/MDsveX) as preproocess.

## Features

- markdown source provide
- classification

## Install

```bash
npm install -D sveltekit-svxutils
# or yarn add -D sveltekit-svxutils
```

## Usage

0. add MDsveX preprocess to svelte.config.js.

```js
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess({}), mdsvex(mdsvexConfig)],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};
export default config;
```

1. create basicly structure

```

└── docs
    └── _posts
        ├── 2021-09-27-second.md
        └── first-page.md

```

2. add site.config.js to root directory

```js
const config = {
	title: 'BlogSite',

	classifier: [
		{ id: 'post', params: { path: '/_posts/' }, type: 'directory' },
		{ id: 'tag', params: { keys: ['tag', 'tags'] }, type: 'frontmatter' }
	]
};
export default config;
```

3. add a endpoint to /src/routes/test.json.ts

```ts
import { siteConfig, sourcePages } from 'sveltekit-svxutils';

export const get = async () => {
	let config = await siteConfig(); // get config.
	let pages = await sourcePages(); // get all pages

	return {
		status: 200,
		body: {
			config,
			pages
		}
	};
};
```

npm run dev

browsering http://localhost:3000/test.json
