import path from 'node:path';

export const rootPath = path.resolve(process.cwd());
export const contentPath = path.resolve(rootPath, 'content');
export const personalPagesPath = path.resolve(rootPath, 'app/personal');

