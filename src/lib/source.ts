import fs from 'fs';
import path from 'path';
import type { SourcePage } from './types';

export interface SourcePageCollection {
  pathMap: Record<string, SourcePage>;
  slugMap: Record<string, Array<SourcePage>>;
}

// Get: All Pages by source.
export const loadSourcePages = async (): Promise<SourcePageCollection> => {
  return await _loadSources();
};

// loading: All md | svx from /docs/*
const _loadSources = async () => {
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
      let sourceStat = await _fsStatAsync(fullPath);
      let frontmatter = pageObj.metadata || {};
      // process indexPath & support customize indexPath by frontmatter.
      let indexPath = sourcePath.replace(/^\/docs/, '').replace(/(?:\.([^.]+))?$/, '');
      indexPath = frontmatter.indexPath ? frontmatter.indexPath : indexPath;
      // process slugPath.
      let { slugName, slugDate } = _getSlugParams(indexPath);
      // if scheme like: 2021-09-30-foo-bar, extract slug.
      if (!(slugName in slugMap)) slugMap[slugName] = [];

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
        render: pageObj.default.render
      };
      // add to pathMap & slugMap
      pathMap[indexPath] = pageStruct;
      slugMap[slugName].push(pageStruct);
      return pageStruct;
    })
  );
  return {
    pathMap: pathMap,
    slugMap: slugMap
  };
};

const _getSlugParams = (indexPath: string) => {
  let baseName = path.basename(indexPath);
  // match slug params
  const regex = /([0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2})\-(.+)/;
  let match = baseName.match(regex);

  if (match) return { slugName: match[2], slugDate: new Date(match[1]) };
  return { slugName: baseName, slugDate: undefined };
};

const _fsStatAsync = async (filePath: string): Promise<Record<string, any>> => {
  return await new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (err) reject(err);

      resolve(stat);
    });
  });
};
