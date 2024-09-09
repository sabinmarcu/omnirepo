import no from './assets/e93.jpg';
import yes from './assets/deirgr1-94e2bb3c-797c-423f-81b1-12c206c2cee9.jpg';
import { Display } from './Display';

export default function Home() {
  return (
    <Display {...{
      yes,
      no,
      releaseDate: '2024-09-09',
    }}
    />
  );
}
