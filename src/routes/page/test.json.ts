import { getPage } from '$lib/index';

export const get = async ({ params }) => {
  let page = await getPage(`/_posts/directorypost2`);

  return {
    status: 200,
    body: {
      page,
      render: page.render()
    }
  };
};
