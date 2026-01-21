import { Icon } from '@/components/Icon';
import { withTooltip } from '@/components/Tooltip.hoc';
import type { HTMLAttributes } from 'react';
import { cls } from '@/utils/cls';
import { mobileTOCTriggerStyles } from './PageTOCLayout.toc.mobile.css';
import { mobileTOCTriggerSelector } from './PageTOCLayout.toc.constants';

export namespace TOCMobileButton {
  export type Props = Omit<HTMLAttributes<HTMLLabelElement>, 'children'>;
}

export const TOCMobileButton = withTooltip(function TOCMobileButton({
  className,
  ...props
}: TOCMobileButton.Props) {
  return (
    <label
      {...props}
      htmlFor={mobileTOCTriggerSelector}
      className={cls(mobileTOCTriggerStyles, className)}
    >
      <input type='checkbox' id={mobileTOCTriggerSelector} />
      <div role='button'>
        <Icon icon='info-circle-solid' />
      </div>
    </label>
  );
}, 'Table of Contents', { position: 'bottom' });

export function TOCMobileCloseButton() {
  return (
    <label htmlFor={mobileTOCTriggerSelector}>
      <div role="button">
        <Icon icon="window-close-solid" />
      </div>
    </label>
  );
}
