import {
  use,
} from 'react';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { rootPath } from '@/constants/paths';
import { iconStyle } from './Icon.css';

export namespace Icon {
  export type Props = {
    icon: string,
  };
}

function walkFs(
  currentPath: string,
  predicate: (input: string) => boolean,
) {
  if (predicate(currentPath)) {
    return currentPath;
  }
  if (currentPath === '/') {
    return undefined;
  }
  return walkFs(path.dirname(currentPath), predicate);
}

const packagePath = 'node_modules/@hackernoon/pixel-icon-library';
const iconsPackagePathPartial = walkFs(
  rootPath,
  (currentPath) => {
    const pathToCheck = path.resolve(
      currentPath,
      packagePath,
    );
    return fs.existsSync(pathToCheck);
  },
);
const iconsPackagePath = path.resolve(
  iconsPackagePathPartial!,
  packagePath,
);

const SvgSourceDirectory = path.resolve(
  iconsPackagePath,
  'icons/SVG',
);

const SvgSourceDirectories = await fsp.readdir(SvgSourceDirectory);

const SvgSourcePaths = SvgSourceDirectories.map(
  (directory) => path.resolve(SvgSourceDirectory, directory),
);

const allIconsRaw = await Promise.all(SvgSourcePaths.map(
  async (directory) => {
    const files = await fsp.readdir(directory);
    const icons = files.map(
      (filename) => {
        const name = filename.slice(0, filename.indexOf('.'));
        const iconPath = path.resolve(directory, filename);
        return [name, iconPath];
      },
    );
    return icons;
  },
));

const allIcons = Object.fromEntries(allIconsRaw.flat());

export function Icon({ icon, ...props }: Icon.Props) {
  const ownIcon = Object.keys(allIcons).includes(icon)
    ? icon
    : 'question';
  const iconPath = allIcons[ownIcon];
  const svgContent = use(fsp.readFile(iconPath, 'utf8'));
  return (<span
    {...props}
    dangerouslySetInnerHTML={{ __html: svgContent }}
    className={iconStyle}
  />);
}
