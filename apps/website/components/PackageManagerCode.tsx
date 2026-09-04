import type { RawCode } from 'codehike/code';
import { CodeWithTabs } from './CodeWithTabs';
import {
  packageManagers,
  parsePackageCommand,
} from './PackageManagerCode.utils';

export namespace PackageManagerCode {
  export type Props = {
    codeblock: RawCode,
    command: string,
  };
}

export function PackageManagerCode({
  codeblock,
  command: commandInput,
}: PackageManagerCode.Props) {
  const command = parsePackageCommand(commandInput || codeblock.value);
  return (
    <CodeWithTabs
      tabs={packageManagers.map((manager) => ({
        lang: 'sh',
        meta: manager.name,
        value: manager.format(command),
      }))}
    />
  );
}
