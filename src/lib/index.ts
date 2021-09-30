import { loadSourcePages } from './source';
import { classifyPages } from './classifier';
import type { SourcePage, SourcePageContext } from './types';

let _config: Record<string, any> = undefined;
/**
 * Get siteConfig
 *
 * @async
 * @return {Promise<Record<string, any>>} custom config.
 */
export const siteConfig = async (): Promise<Record<string, any>> => {
  let glob = import.meta.glob('/site.config.js');
  if (!Object.keys(glob).length) glob = import.meta.glob('/src/site.config.js')
  if (!Object.keys(glob).length) throw new Error('site.config.js not found.');
  let loadConfig = await glob[Object.keys(glob)[0]]();
  _config = loadConfig.default;
  return _config;
};

// cache sourcepages.
let _pathMap: Record<string, SourcePage> = undefined;
/**
 * Get All source page, index by indexPath
 *
 * @async
 * @return {Promise<Record<string, SourcePage>>} key: IndexPath value: SourcePage
 */
export const pageMap = async (): Promise<Record<string, SourcePage>> => {
  if (!_pathMap) await _initializeMap();

  return _pathMap;
};

let _slugMap: Record<string, Array<SourcePage>> = undefined;
/**
 * Get All source page, index by slugName
 *
 * @async
 * @return {Promise<Record<string, Array<SourcePage>>>}
 */
export const slugMap = async (): Promise<Record<string, Array<SourcePage>>> => {
  if (!_slugMap) await _initializeMap();

  return _slugMap;
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
    const classifierList = (await siteConfig()).classifier || [];
    const list: Array<SourcePage> = Object.values(await pageMap());
    _classifiedCollection = await classifyPages({ classifierList: classifierList, pages: list });
  }

  const _classifiedSet = _classifiedCollection[classifierId];
  if (_classifiedSet) return _classifiedSet;

  throw new Error(`classifierId: ${classifierId} not found.`);
};

export const getPage = async (
  indexKey: string,
  slugMatchFunc?: (page: SourcePage) => boolean
): Promise<SourcePage> => {
  let page = undefined;
  // try get page from slugMap
  const _slugMap = await slugMap();
  let slugPages = _slugMap[indexKey];

  if (slugPages) {
    return slugMatchFunc 
      ? slugPages.find((page) => slugMatchFunc(page))
      : slugPages[0];
  }
  // try get page from pageMap
  const _pathMap = await pageMap();
  page = _pathMap[indexKey];
  if (page) return page;

  // throw error message.
  let avaliablePath = Object.keys(_pathMap).join('\r\t');
  throw new Error(`path ${indexKey} is not found. available path:\r\t${avaliablePath} \n`);
};

const _initializeMap = async () => {
  let { pathMap, slugMap } = await loadSourcePages();
  _pathMap = pathMap;
  _slugMap = slugMap;
};

export type { DirectoryClassifierResult, FrontMatterClassifierResult } from './classifier';
export type { SourcePage, SourcePageContext };

export default {
  siteConfig,
  pageMap,
  slugMap,
  classifiedSet,
  getPage
}
