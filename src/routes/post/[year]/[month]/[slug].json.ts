import type { RequestHandler } from '@sveltejs/kit';
import { getPage, SourcePage } from '$lib/index';

export const get: RequestHandler = async () => {
  // get by slugName
  let normalPage = await getPage('first-post');

  // get by slugName & use match.
  let matchPage = await getPage('first-post', (page: SourcePage) => {
    let date = new Date(page.frontMatter.created);
    return date.getFullYear() == 2021 && date.getMonth() + 1 == 9 && date.getDate() == 18;
  });

  return {
    status: 200,
    body: {
      normalPage,
      matchPage
    }
  };
};
