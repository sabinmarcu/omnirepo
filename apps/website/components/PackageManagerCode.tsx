import type { RawCode } from 'codehike/code';
import { cookies } from 'next/headers';
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

export async function PackageManagerCode({
  codeblock,
  command: commandInput,
}: PackageManagerCode.Props) {
  const command = parsePackageCommand(commandInput || codeblock.value);
  const selectedManager = (await cookies()).get('package-manager')?.value;
  const initialSyncedLabel = packageManagers.some(
    (manager) => manager.name === selectedManager,
  )
    ? selectedManager
    : undefined;

  return (
    <CodeWithTabs
      syncStorageKey="package-manager"
      initialSyncedLabel={initialSyncedLabel}
      tabs={packageManagers.map((manager) => ({
        lang: 'sh',
        meta: manager.name,
        value: manager.format(command),
      }))}
    />
  );
}
