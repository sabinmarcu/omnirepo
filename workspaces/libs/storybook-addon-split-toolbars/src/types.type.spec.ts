import type {
  ToolbarConfig,
  ToolbarConfigList,
  ToolbarConfigRecord,
} from './types.js';

type TestToolbarConfig<T extends unknown> = (
  T extends ToolbarConfig ? true : false
);
type TestToolbarConfigList<T extends unknown> = (
  T extends ToolbarConfigList ? true : false
);
type TestToolbarConfigRecord<T extends unknown> = (
  T extends ToolbarConfigRecord ? true : false
);

const toolbarConfig1 = {
  title: 'Theme',
  items: ['a', 'b'],
};
type TestToolbarConfig1 = TestToolbarConfig<typeof toolbarConfig1>;
//     ^? type TestToolbarConfig1 = false
type TestToolbarConfigList1 = TestToolbarConfigList<typeof toolbarConfig1>;
//     ^? type TestToolbarConfigList1 = false
type TestToolbarConfigRecord1 = TestToolbarConfigRecord<typeof toolbarConfig1>;
//     ^? type TestToolbarConfigRecord1 = false

const toolbarConfig2 = {
  ...toolbarConfig1,
  items: [
    {
      title: 'light',
      value: 'light',
    },
    {
      title: 'dark',
      value: 'dark',
    },
  ],
};
type TestToolbarConfig2 = TestToolbarConfig<typeof toolbarConfig2>;
//     ^? type TestToolbarConfig2 = false
type TestToolbarConfigList2 = TestToolbarConfigList<typeof toolbarConfig2>;
//     ^? type TestToolbarConfigList2 = false
type TestToolbarConfigRecord2 = TestToolbarConfigRecord<typeof toolbarConfig2>;
//     ^? type TestToolbarConfigRecord2 = false

const toolbarConfig3 = {
  ...toolbarConfig2,
  items: {
    fromFigma: {
      title: 'Theme from Figma',
      icon: 'circlehollow' as any,
      list: [
        'figma-light', 'figma-dark',
      ],
    },
    fromConfig: {
      title: 'Theme from Config',
      icon: 'circlehollow' as any,
      list: [
        'config-light', 'config-dark',
      ],
    },
  },
};
type TestToolbarConfig3 = TestToolbarConfig<typeof toolbarConfig3>;
//     ^? type TestToolbarConfig3 = true
type TestToolbarConfigList3 = TestToolbarConfigList<typeof toolbarConfig3>;
//     ^? type TestToolbarConfigList3 = false
type TestToolbarConfigRecord3 = TestToolbarConfigRecord<typeof toolbarConfig3>;
//     ^? type TestToolbarConfigRecord3 = true
