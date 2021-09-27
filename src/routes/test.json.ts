import type { DirectoryClassifierResult, FrontMatterClassifierResult } from '$lib/index';
import { pageMap, classifiedSet, siteConfig } from '$lib/index';

export const get = async () => {
	const map = await pageMap();
	const posts: DirectoryClassifierResult = await classifiedSet('post');
	const tags: FrontMatterClassifierResult = await classifiedSet('tag');

	return {
		status: 200,
		body: {
			config: siteConfig,
			map,
			posts,
			tags
		}
	};
};
