import type { DirectoryClassifierResult, FrontMatterClassifierResult } from '$lib/index';
import { sourcePages, classifiedSet, siteConfig } from '$lib/index';

export const get = async () => {

  const config = await siteConfig();
  const pageMap = await sourcePages();
  
  const posts: DirectoryClassifierResult = await classifiedSet("post");
  const tags: FrontMatterClassifierResult = await classifiedSet("tag");

  return {
    status: 200,
    body: {
      config,
      pageMap,
      posts,
      tags
    }

  }

}
