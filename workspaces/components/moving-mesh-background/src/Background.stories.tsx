import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import styled from '@emotion/styled';

import type { ComponentProps } from 'react';
import { Background } from './Background.js';

const range = (min: number, max: number, step?: number) => ({
  control: {
    type: 'range',
    min,
    max,
    step,
  },
} as const);

const meta: Meta<typeof Background> = {
  component: Background,
  argTypes: {
    color: { control: 'color' },
    every: range(50, 200),
    size: range(1, 10, 0.5),
    speed: range(0.5, 10, 0.1),
    variance: range(20, 200),
    tolerance: range(0, 100),
  },
};

export default meta;

type Story = StoryObj<typeof Background>;

const ShowcaseWrapper = styled.div({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const StyledBackground = styled(Background)({
  width: '100%',
  height: '100%',
});

function Wrapper(properties: ComponentProps<typeof Background>) {
  return (
    <ShowcaseWrapper>
      <StyledBackground {...properties} />
    </ShowcaseWrapper>
  );
}
export const BaseProperties: Story = {
  args: {
    color: '#c40808',
    every: 150,
    size: 4,
    variance: 50,
    speed: 1.5,
    tolerance: 50,
  },
  render: Wrapper,

};
