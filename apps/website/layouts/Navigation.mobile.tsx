import { Icon } from '@/components/Icon';
import {
  backdropStyles,
  triggerStyles,
} from './Navigation.mobile.css';

const mobileNavigationTriggerSelector = 'mobile-navigation-trigger';
export function NavigationMobileButton() {
  return (
    <label htmlFor={mobileNavigationTriggerSelector} className={triggerStyles}>
      <input type='checkbox' id={mobileNavigationTriggerSelector} />
      <div role='button'>
        <Icon icon='bars' />
      </div>
    </label>
  );
}

export function NavigationBackdrop() {
  return (
    <label
      htmlFor={mobileNavigationTriggerSelector}
      className={backdropStyles}
    />
  );
}
