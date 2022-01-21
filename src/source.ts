import fs from 'fs/promises';
import path from 'path';
import type { SourcePage, SourcePageContext, SourcePageCollection } from './types';
import { getAbsoultPath } from './internal';

// Get: All Pages by source.
export const loadSourcePages = async (sourceDir: string): Promise<SourcePageCollection> => {
  return await loadSources(sourceDir);
};

// Get Config.
export const loadConfig = async (configPath?: string): Promise<Record<string, any>> => {
  let path = getAbsoultPath(configPath);
  let _loadConfig = await import(path);
  return _loadConfig.default;
}


// loading: All md | svx from /docs/*
const loadSources = async (sourceDir: string) => {
  console.log('::: Loading docs ::: ');
  // loading source by vite & fast-glob.
  let sources = import.meta.glob('/docs/**/*.+(md|svx)');
  let pathMap: Record<string, SourcePage> = {};
  let slugMap: Record<string, Array<SourcePage>> = {};
  await Promise.all(
    Object.entries(sources).map(async ([sourcePath, pageAsync]) => {
      let pageObj = await pageAsync(); // get page data by lazyloading.
      // get file path & created datetime.
      let fullPath = path.join(process.cwd(), sourcePath);
      let sourceStat = await fs.stat(fullPath);
      let frontmatter = pageObj.metadata || {};
      // process indexPath & support customize indexPath by frontmatter.
      let indexPath = sourcePath.replace(/^\/docs/, '').replace(/(?:\.([^.]+))?$/, '');
      indexPath = frontmatter.indexPath ? frontmatter.indexPath : indexPath;
      // process slugPath.
      let { slugKey, slugDate } = getSlugParams(indexPath);
      // if scheme like: 2021-09-30-foo-bar, extract slug.
      if (!(slugKey in slugMap)) slugMap[slugKey] = [];
      // attach created datetime & get indexPath.
      frontmatter.created = frontmatter.created
        ? frontmatter.created
        : slugDate
        ? slugDate
        : sourceStat.birthtime;
      
      // generate struct.
      const pageStruct = {
        frontMatter: frontmatter,
        sourcePath: sourcePath,
        indexPath: indexPath,
        render: attachRender(pageObj.default.render),
        slugKey: slugKey
      };
      // add to pathMap & slugMap
      pathMap[indexPath] = pageStruct;
      slugMap[slugKey].push(pageStruct);
      return pageStruct;
    })
  );
  return {
    pathMap: pathMap,
    slugMap: slugMap
  };
};


export const getAvaliableSource = async ( sourceDir: string, filter=['.svx', '.md'] ) => {  
  // define recursive method.
  const walk = async (sourcePath: string, initialContainer: Object) => {  
    let items = await fs.readdir(sourcePath);
    
    items.map(async (item: string) => {
      const itemPath = path.join(sourcePath, item);
      const fullPath = getAbsoultPath(itemPath);
      
      const fstat = await fs.stat(fullPath);
      if (fstat.isDirectory())  {
        initialContainer = await walk(itemPath, initialContainer);

      } else if (fstat.isFile()) {
        filter.map( (sname: string) => {
          // console.log(itemPath)
          if (item.includes(sname)) {
            initialContainer[itemPath] = () => import(itemPath);
          }
        }); 
      }
    });

    console.log("yeee", initialContainer);
    return initialContainer
  };
  
  return await walk(sourceDir, {});

}

const getSlugParams = (indexPath: string) => {
  let baseName = path.basename(indexPath);
  // match slug params
  const regex = /([0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2})\-(.+)/;
  let match = baseName.match(regex);

  if (match) return { slugKey: match[2], slugDate: new Date(match[1]) };
  return { slugKey: baseName, slugDate: undefined };
};

const attachRender = ( renderFunc : Function )  => {
  return () : SourcePageContext => {
    const context = renderFunc();
    return {
      ...context,
      style: `<style>${context.css.code}</style>`
    }

  }
}

