# SvxUtils

An easily & useful markodwn content provider for SvelteKit. use [MDsveX](https://github.com/pngwn/MDsveX) as preproocess.


## Features

- Markdown source provide
- Classification

## Install

```bash
npm install -D sveltekit-svxutils
# or yarn add -D sveltekit-svxutils
```

## Usage

- Add mdsvex preprocess to svelte.config.js.

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

- Create structure

```

└── docs
    └── _posts
        ├── 2021-09-27-second.md
        └── first-page.md

```

- Add site.config.js to root directory

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

- Add an endpoint to /src/routes/test.json.ts

```ts
import type { 
  DirectoryClassifierResult, 
  FrontMatterClassifierResult, 
  SourcePage 
} from 'sveltekit-svxutils';
import { pageMap, classifiedSet, siteConfig, getPage } from 'sveltekit-svxutils';

export const get = async () => {
  const title = (await siteConfig()).title;
	const map = await pageMap();
	const posts: DirectoryClassifierResult = await classifiedSet('post');
	const tags: FrontMatterClassifierResult = await classifiedSet('tag');
  const testPage: SourcePage = await getPage("/_posts/first-post");
  const pageContent = testPage.render()

	return {
		status: 200,
		body: {
      title,
			map,
			posts,
			tags,
      pageContent
		}
	};
};
```

- Finally, run develop server & browsing http://localhost:3000/test.json

