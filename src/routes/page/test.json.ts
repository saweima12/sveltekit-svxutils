import { getPage } from '$lib/index';

export const get = async () => {
  let page = await getPage(`/_posts/directorypost2`);

  return {
    status: 200,
    body: {
      page,
      context: page.render()
    }
  };
};
