import { Icon } from '@/components/Icon';
import { mobileTOCTriggerStyles } from './PageTOCLayout.toc.mobile.css';
import { mobileTOCTriggerSelector } from './PageTOCLayout.toc.constants';

export function TOCMobileButton() {
  return (
    <label htmlFor={mobileTOCTriggerSelector} className={mobileTOCTriggerStyles}>
      <input type='checkbox' id={mobileTOCTriggerSelector} />
      <div role='button'>
        <Icon icon='info-circle-solid' />
      </div>
    </label>
  );
}

export function TOCMobileCloseButton() {
  return (
    <label htmlFor={mobileTOCTriggerSelector}>
      <div role="button">
        <Icon icon="window-close-solid" />
      </div>
    </label>
  );
}
