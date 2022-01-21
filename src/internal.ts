import path from 'path';


export const getAbsoultPath = (relativePath: string): string => {
  const cwd = process.cwd();
  return path.join(cwd, relativePath);
}

export const getRelativePath = (absoultPath: string): string => {
  const cwd = process.cwd();
  return path.relative(cwd, absoultPath);
}

