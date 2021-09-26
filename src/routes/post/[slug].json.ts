import { classifiedSet, getPage, siteConfig, SourcePage } from '$lib/index';

export const get = async ( {params} ) => {
  
  let { slug } = params;  
  let page : SourcePage = await getPage(`/_posts/${slug}`);

  return {
    status: 200,
    body: {
      ...page,
      ...page.render
    }
  }

  

}


