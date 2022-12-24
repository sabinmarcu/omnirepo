import {
  Command,
  Option,
} from 'clipanion';

export class HelloCommand extends Command {
  static paths = [
    ['hello'],
    // Command.Default,
  ];

  name = Option.String();

  static usage = Command.Usage({
    category: 'My category',
    description: 'A small description of the command.',
    details: `
      A longer description of the command with some \`markdown code\`.
      
      Multiple paragraphs are allowed. Clipanion will take care of both reindenting the content and wrapping the paragraphs as needed.
    `,
    examples: [
      [
        'A basic example',
        '$0 my-command',
      ], 
      [
        'A second example',
        '$0 my-command --with-parameter',
      ]
    ],
  });

  async execute() {
    this.context.stdout.write(`Hello ${this.name}!\n`);
  }
}
