import type {
  ComponentProps,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { withStyles } from '@/hocs/withStyles';
import { Typography } from './primitives/Typography';
import {
  cardThumbnailStyle,
  cardTitleStyle,
  cardWrapperStyle,
} from './Card.css';

export namespace CardWrapper {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
  );
}

export const CardWrapper = withStyles(
  function CardWrapper(props: CardWrapper.Props) {
    return (<article {...props} {...{ [Typography.unstyledDataAttribute]: true }} />);
  },
  cardWrapperStyle,
);

export namespace CardTitle {
  export type Props = (
    & Omit<ComponentProps<typeof Typography>, 'as'>
    & Partial<Pick<ComponentProps<typeof Typography>, 'as'>>
  );
}

export const CardTitle = withStyles(
  function CardTitle({ as, ...props }: CardTitle.Props) {
    return (<Typography {...props} as={as ?? 'h2'} />);
  },
  cardTitleStyle,
);

export namespace CardThumbnail {
  export type Props = PropsWithChildren<
    HTMLAttributes<HTMLDivElement>
  >;
}

export const CardThumbnail = withStyles(
  function CardThumbnail({ children, ...props }: CardThumbnail.Props) {
    return (
      <div {...props}>
        <div>{children}</div>
      </div>
    );
  },
  cardThumbnailStyle,
);
