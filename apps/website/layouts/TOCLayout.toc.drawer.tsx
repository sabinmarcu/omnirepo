import { Icon } from '@/components/Icon';
import { withTooltip } from '@/components/Tooltip.hoc';
import { cls } from '@/utils/cls';
import {
  tocDrawerCloseStyles,
  tocDrawerTriggerStyles,
} from './TOCLayout.toc.drawer.css';
import { tocPopoverId } from './TOCLayout.toc.constants';

export namespace TOCDrawerTrigger {
  export type Props = { className?: string };
}

export const TOCDrawerTrigger = withTooltip(function TOCDrawerTrigger({
  className,
}: TOCDrawerTrigger.Props) {
  return (
    <button
      type="button"
      popoverTarget={tocPopoverId}
      popoverTargetAction="show"
      aria-label="Table of Contents"
      className={cls(tocDrawerTriggerStyles, className)}
    >
      <Icon icon="bullet-list-solid" />
    </button>
  );
}, 'Table of Contents', { position: 'right' });

export function TOCDrawerCloseButton() {
  return (
    <button
      type="button"
      popoverTarget={tocPopoverId}
      popoverTargetAction="hide"
      aria-label="Close Table of Contents"
      className={tocDrawerCloseStyles}
    >
      <Icon icon="window-close-solid" />
    </button>
  );
}
