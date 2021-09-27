import { loadSourcePages } from './source';
import { classifyPages } from './classifier';
import type { SourcePage } from './types';

// @ts-ignore
import siteConfig from '/site.config.js';
export { siteConfig };

// cache sourcepages.
let _sources: Record<string, SourcePage> = undefined;
/**
 * Get All .md | .svx page from /docs/**
 *
 * @async
 * @return {Promise<Record<string, SourcePage>>} key: IndexPath value: SourcePage
 */
export const pageMap = async (): Promise<Record<string, SourcePage>> => {
	if (!_sources) _sources = await loadSourcePages();

	return _sources;
};

// cache classified result.
let _classifiedCollection: Record<string, any> = undefined;
/**
 * Get classified pages set.
 *
 * @async
 * @param {string} classifierId
 * @return {Promise<Record<string,any>>}
 */
export const classifiedSet = async (classifierId: string): Promise<any> => {
	// classify all SourcePage.
	if (!_classifiedCollection) {
		const classifierList = siteConfig.classifier || [];
		const list: Array<SourcePage> = Object.values(await pageMap());
		_classifiedCollection = await classifyPages({ classifierList: classifierList, pages: list });
	}

	const _classifiedSet = _classifiedCollection[classifierId];
	if (_classifiedSet) return _classifiedSet();

	throw new Error(`classifierId: ${classifierId} not found.`);
};

/**
 * Get page by indexPath
 *
 * @async
 * @param {string} indexPath
 * @throws {Error}
 * @return {Promise<SourcePage>}
 */
export const getPage = async (indexPath: string): Promise<SourcePage> => {
	const pages = await pageMap();
	const page = pages[indexPath];

	if (page) return page;

	throw new Error(`path ${indexPath} not found.`);
};

export type { DirectoryClassifierResult, FrontMatterClassifierResult } from './classifier';

export type { SourcePage };
