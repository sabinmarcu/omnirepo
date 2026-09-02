import { format } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { footerStyles } from './Footer.css';

export async function Footer() {
  const translate = await getTranslations('footer');
  return (
    <footer className={footerStyles}>
      <p>{translate('credit')}</p>
      <p>
        (2025 -
        {format(new Date(), 'yyyy')}
        )
      </p>
    </footer>
  );
}
