/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
  userid: string;
}

export interface SourcePage extends Record<string, any> {
  frontMatter: Record<string, any>;
  sourcePath: PathLike | string;
  indexPath: PathLike | string;
  render: Function;
}
