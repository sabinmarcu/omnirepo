import { LandingCard } from './LandingCard';
import {
  landingPageList,
  landingPageLogo,
  landingPageWrapper,
} from './page.css';

export default function Home() {
  return (
    <main className={landingPageWrapper}>
      <div className={landingPageLogo} />
      <section className={landingPageList}>
        <LandingCard theme="personal" wip>
          <h1>About Me</h1>
        </LandingCard>
        <LandingCard theme="projects" >
          <h1>Active Projects</h1>
        </LandingCard>
        <LandingCard theme="articles" wip>
          <h1>Articles</h1>
        </LandingCard>
        <LandingCard theme="ramblings" wip>
          <h1>Ramblings</h1>
        </LandingCard>
        <LandingCard theme="snippets" wip>
          <h1>Snippets</h1>
        </LandingCard>
      </section>
    </main>
  );
}