import type { PropsWithChildren } from 'react';
import {
  AppWrapper,
  BackgroundWrapper,
  StyledBackground,
} from './Background.style.js';

export function Background({ children }: PropsWithChildren) {
  return (
    <AppWrapper>
      <BackgroundWrapper>
        <StyledBackground every={130} tolerance={10} />
      </BackgroundWrapper>
      {children}
    </AppWrapper>
  );
}

