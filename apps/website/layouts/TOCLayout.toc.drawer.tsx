import { Icon } from '@/components/Icon';
import { getTranslations } from 'next-intl/server';
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

const TOCDrawerTriggerWithTooltip = withTooltip(function TOCDrawerTriggerWithTooltip({
  className,
  tooltip,
}: TOCDrawerTrigger.Props & { tooltip?: string }) {
  return (
    <button
      type="button"
      popoverTarget={tocPopoverId}
      popoverTargetAction="show"
      aria-label={tooltip}
      className={cls(tocDrawerTriggerStyles, className)}
    >
      <Icon icon="bullet-list-solid" />
    </button>
  );
}, undefined, { position: 'right' });

export async function TOCDrawerTrigger(props: TOCDrawerTrigger.Props) {
  const translate = await getTranslations('tableOfContents');
  return <TOCDrawerTriggerWithTooltip {...props} tooltip={translate('label')} />;
}

export async function TOCDrawerCloseButton() {
  const translate = await getTranslations('tableOfContents');
  return (
    <button
      type="button"
      popoverTarget={tocPopoverId}
      popoverTargetAction="hide"
      aria-label={translate('close')}
      className={tocDrawerCloseStyles}
    >
      <Icon icon="window-close-solid" />
    </button>
  );
}
