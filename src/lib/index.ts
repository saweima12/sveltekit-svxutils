import { loadConfig, loadSourcePages } from './source';
import { classifyPages } from './classifier';
import type { SourcePage } from './types';

// cache configfile.
let _config: Record<string, any> = undefined;

/**
 * Get site.config.js data.
 *
 * @async
 * @param [configPath] - configure filepath
 * @return {Promise<[Record<string, any>]>}
 */
export const siteConfig = async(configPath?: string) : Promise<Record<string,any>> => {
  if (!_config)
    _config = await loadConfig(configPath);
  
  return _config
}

// cache sourcepages.
let _sources : Record<string, SourcePage> = undefined;
/**
 * Get All .md | .svx page from /docs/**
 *
 * @async
 * @return {Promise<Record<string, SourcePage>>} key: IndexPath value: SourcePage
 */
export const sourcePages = async() : Promise<Record<string, SourcePage>> => {
  if (!_sources) 
    _sources = await loadSourcePages();

  return _sources;
}

// cache classified result.
let _classifiedCollection: Record<string, any> = undefined;
/**
 * Get classified pages set.
 *
 * @async
 * @param {string} classifierId
 * @return {Promise<Record<string,any>>} 
 */
export const classifiedSet = async(classifierId: string) : Promise<any> => {
  // classify all SourcePage.
  if (!_classifiedCollection) {
    const config = await siteConfig();
    const classifierList = config.classifier || [];
    const list : Array<SourcePage> = Object.values(await sourcePages());
    _classifiedCollection = await classifyPages({ classifierList: classifierList, pages: list }); 
  }

  const _classifiedSet = _classifiedCollection[classifierId];
  if (_classifiedSet)
    return _classifiedSet()

  throw new Error(`classifierId: ${classifierId} not found.`);
} 

export const getPage = async (indexPath: string) : Promise<SourcePage> => {
  const pages = await sourcePages();
  const page = pages[indexPath];
  
  if (page)
    return page;

  throw new Error(`path ${indexPath} not found.`);
}


export type { 
  DirectoryClassifierResult, 
  FrontMatterClassifierResult  
} from './classifier';

export type {
  SourcePage
}
