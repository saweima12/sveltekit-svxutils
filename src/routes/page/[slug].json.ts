import { getPage } from '$lib/index';

export const get = async ({ params }) => {
	let { slug } = params;
	let page = await getPage(`/${slug}`);

	return {
		status: 200,
		body: {
			page,
			render: page.render()
		}
	};
};
