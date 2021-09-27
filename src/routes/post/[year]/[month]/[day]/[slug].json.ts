import { getPage, SourcePage } from '$lib/index';

export const get = async ({ params }) => {
	let { year, month, day, slug } = params;
	let page: SourcePage = await getPage(`/_posts/${year}-${month}-${day}-${slug}`);

	return {
		status: 200,
		body: {
			...page,
			...page.render
		}
	};
};
