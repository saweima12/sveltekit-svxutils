import type { 
  DirectoryClassifierResult, 
  FrontMatterClassifierResult, 
  SourcePage 
} from '$lib/index';
import { pageMap, classifiedSet, siteConfig, getPage } from '$lib/index';

export const get = async () => {
  const title = siteConfig.title;
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
