import z from 'zod';

const installCommandSchema = z.object({
  operation: z.literal('install'),
  packages: z.string().min(1),
});

const execCommandSchema = z.object({
  operation: z.literal('exec'),
  package: z.string().min(1).optional(),
  command: z.string().min(1),
});

const packageCommandSchema = z.discriminatedUnion('operation', [
  installCommandSchema,
  execCommandSchema,
]);

export type PackageCommand = z.infer<typeof packageCommandSchema>;

type PackageManager = {
  name: string,
  format: (command: PackageCommand) => string,
};

export const packageManagers = [
  {
    name: 'yarn',
    format: (command) => (command.operation === 'install'
      ? `yarn install ${command.packages}`
      : `yarn dlx${command.package ? ` -p ${command.package}` : ''} ${command.command}`),
  },
  {
    name: 'pnpm',
    format: (command) => (command.operation === 'install'
      ? `pnpm install ${command.packages}`
      : `pnpm dlx${command.package ? ` --package ${command.package}` : ''} ${command.command}`),
  },
  {
    name: 'npm',
    format: (command) => (command.operation === 'install'
      ? `npm install ${command.packages}`
      : `npx${command.package ? ` --package ${command.package}` : ''} ${command.command}`),
  },
] as const satisfies readonly PackageManager[];

export function parsePackageCommand(input: string): PackageCommand {
  const command = input.trim();
  const installMatch = /^install\s+(.+)$/.exec(command);
  if (installMatch) {
    return packageCommandSchema.parse({
      operation: 'install',
      packages: installMatch[1],
    });
  }

  const execMatch = /^exec\s+(.+)$/.exec(command);
  if (execMatch) {
    const packageMatch = /^--package(?:=|\s+)(\S+)\s+(.+)$/.exec(execMatch[1]);
    return packageCommandSchema.parse({
      operation: 'exec',
      package: packageMatch?.[1],
      command: packageMatch?.[2] ?? execMatch[1],
    });
  }

  throw new Error(
    `Unsupported !package command: ${JSON.stringify(command)}. Expected "install <packages>" or "exec [--package <package>] <command>".`,
  );
}
