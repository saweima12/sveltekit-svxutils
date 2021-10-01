import type { DirectoryClassifierResult, FrontMatterClassifierResult } from '$lib/index';
import { pageMap, slugMap, classifiedSet, getParamalink } from '$lib/index';

export const get = async () => {
  const _pathMap = await pageMap();
  const _slugMap = await slugMap();

  const posts: DirectoryClassifierResult = await classifiedSet('post');
  const tags: FrontMatterClassifierResult = await classifiedSet('tag');
  
  return {
    status: 200,
    body: {
      pathMap: _pathMap,
      slugMap: _slugMap,
      posts,
      tags
    }
  };
};
