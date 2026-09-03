/* eslint-disable no-continue */
import { PageLayout } from '@/layouts/PageLayout';

const pageLayoutInsetVariants = Object.keys(
  PageLayout.Inset.selectors.variant,
) as unknown as (
  keyof typeof PageLayout.Inset.selectors.variant
)[];

type GroupType = {
  name: string,
  comment?: string[],
  variant?: typeof pageLayoutInsetVariants[number]
  lines: string[]
};

export namespace parseSourceCode {
  export type CodeGroup = ReturnType<typeof parseSourceCode>[number];
  export type Output = ReturnType<typeof parseSourceCode>[];
}

export function parseSourceCode(code: string) {
  const withoutEslint = code.replaceAll(/\n?(?:\/\/|\/\*)\s*eslint-disable[^\n]+/gm, '');

  const rootGroup: GroupType = {
    name: 'ROOT',
    lines: [],
  };

  let currentGroup: GroupType | undefined;
  let currentCommentGroup: string[] | undefined;
  const groups: GroupType[] = [
    rootGroup,
  ];
  for (const line of withoutEslint.split('\n')) {
    const [
      startRegionMatch,
      startCommentMatch,
      endRegionMatch,
      endCommentMatch,
      variantMatch,
      commentMatch,
    ] = [
      line.match(/^(?:\/\/|\/\*+)\s*#region\s*(.+)$/),
      line.match(/^\/\*\*\s*$/),
      line.match(/^(?:\/\/|\/\*+)\s*#endregion.*$/),
      line.match(/^\s*\*\/\s*$/),
      line.match(/^(?:\/\/|\/\*+)\s*#variant\s*(.+)$/),
      line.match(/^\s*\*\s*(.+)\s*$/),
    ];
    if (startRegionMatch) {
      if (currentGroup) {
        throw new Error(`Group "${currentGroup.name} is already open while attempting to start group "${startRegionMatch[1]}"`);
      }
      if (currentCommentGroup) {
        throw new Error(`Comment group is already open while attempting to start group "${startRegionMatch[1]}"`);
      }
      currentGroup = {
        name: startRegionMatch[1],
        lines: [],
      };
      continue;
    }
    if (startCommentMatch) {
      if (currentCommentGroup) {
        throw new Error('Comment group is already open while attempting to start comment group');
      }
      currentCommentGroup = [];
      continue;
    }
    if (endRegionMatch) {
      if (!currentGroup) {
        throw new Error(`Attempting to close group "${endRegionMatch[1]}" without being open`);
      }
      if (currentCommentGroup) {
        throw new Error(`Attempting to close group "${endRegionMatch[1]}" while a comment group is open`);
      }
      groups.push(currentGroup);
      currentGroup = undefined;
      continue;
    }
    if (endCommentMatch) {
      if (!currentCommentGroup) {
        throw new Error('Attempting to close an comment group that has not be opened');
      }
      (currentGroup ?? rootGroup).comment = currentCommentGroup;
      currentCommentGroup = undefined;
      continue;
    }
    if (variantMatch) {
      const targetGroup = currentGroup ?? rootGroup;
      if (!pageLayoutInsetVariants.includes(variantMatch[1] as any)) {
        throw new Error(`Attempting to set invalid variant (${variantMatch[1]}) to group "${targetGroup.name}"`);
      }
      targetGroup.variant = variantMatch[1] as any;
      continue;
    }
    if (commentMatch) {
      if (!currentCommentGroup) {
        throw new Error('Attempting to add comment line to an unopened comment group');
      }
      currentCommentGroup.push(commentMatch[1]);
      continue;
    }
    (currentGroup ?? rootGroup).lines.push(line);
  }
  return groups
    .filter(({ name }) => !/^ignore/i.test(name))
    .map(({
      name,
      lines,
      variant,
      comment,
    }) => {
      const trimmedLines: string[] = [...lines];
      while (trimmedLines[0] === '') {
        trimmedLines.shift();
      }
      while (trimmedLines.at(-1) === '') {
        trimmedLines.pop();
      }

      return {
        title: name,
        variant,
        comment,
        content: trimmedLines.join('\n'),
      };
    });
}
