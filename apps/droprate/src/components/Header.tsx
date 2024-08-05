import type { PropsWithChildren } from 'react';
import {
  HeadingSection,
  Heading,
  BackgroundWrapper,
  Background,
} from './Header.style';

export function Header({ children }: PropsWithChildren) {
  return (
    <HeadingSection>
      <BackgroundWrapper>
        <Background every={75} speed={5} />
      </BackgroundWrapper>
      <Heading>{children}</Heading>
    </HeadingSection>
  );
}
