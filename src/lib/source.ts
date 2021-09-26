import fs from 'fs';
import path from 'path';
import type { SourcePage } from './types';

let _config = undefined;

// Get: All Pages by source.
export const loadSourcePages : (() => Promise<Record<string, SourcePage>>)= async () => { 
  return await _loadSources();
}

export const loadConfig : (( configPath?:string ) => Promise<Record<string, unknown>>) = async(configPath) => {
  configPath = configPath || "site.config.js";

  const importPath = path.join(process.cwd(), configPath)
  if (!fs.existsSync(importPath)) 
    return {}

  _config = await import(importPath);
  return _config.default;
};

// loading: All md | svx from /docs/*
const _loadSources = async() => {
  console.log("::: Loading docs ::: ")
  // loading source by vite & fast-glob.
  let sources = import.meta.glob("/docs/**/*.+(md|svx)");
  let map : Record<string, SourcePage> = {};
  await Promise.all(
    Object.entries(sources).map(
      async ([sourcePath, pageAsync]) => {
        let pageObj = await pageAsync(); // get page data by lazyloading.
        // get file path & created datetime.
        let fullPath = path.join(process.cwd(), sourcePath);
        let sourceStat = await _fsStatAsync(fullPath);
        // attach created datetime.
        let frontmatter = pageObj.metadata || {}; 
        frontmatter.created = frontmatter.created ? frontmatter.created : sourceStat.birthtime;
        // process index path.
        let replacedPath = sourcePath.replace(/^\/docs/, "");
        replacedPath = replacedPath.replace(/(?:\.([^.]+))?$/, "");

        const pageStruct = {
          frontMatter: frontmatter,
          sourcePath: sourcePath,
          indexPath: replacedPath,
          render: pageObj.default.render
        };
        map[replacedPath] = pageStruct;
        return pageStruct;
      } 
    )
  );
  return map;
};

const _fsStatAsync = async(filePath: string) : Promise<Record<string, any>> => {
  return await new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (err)
        reject(err);
      
      resolve(stat);
    })
  });

}
