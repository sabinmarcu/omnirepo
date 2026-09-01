import { format } from 'date-fns';
import { footerStyles } from './Footer.css';

export function Footer() {
  return (
    <footer className={footerStyles}>
      <p>Built and maintained by Sabin Marcu</p>
      <p>
        (2025 -
        {format(new Date(), 'yyyy')}
        )
      </p>
    </footer>
  );
}
