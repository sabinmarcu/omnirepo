module.exports.default = (originalPath) => {
  if (!originalPath.startsWith('@sabinmarcu/')) {
    return originalPath;
  }
  if (originalPath.includes('/src')) {
    return originalPath;
  }
  const [scopeName, packageName, ...path] = originalPath.split('/');
  return [scopeName, packageName, 'src', ...path].join('/');
};
