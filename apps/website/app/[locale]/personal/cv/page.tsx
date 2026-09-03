import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { canonicalMetadata } from '@/i18n/metadata';
import { isLocale } from '@/i18n/locales';
import { LocaleSuggestionBanner } from '@/i18n/LocaleSuggestionBanner';
import { experimentEnabled } from '@/experiments/utils';
import { CVResource } from '@/models/CVResource';
import { Grid } from '@/components/Grid';
import { Typography } from '@/components/mdx/Typography';
import { TOCLayout } from '@/layouts/TOCLayout';
import { InfoTagList } from './components/InfoTag';
import {
  cvPageStyles,
  cvPageBioStyles,
  cvIntroStyles,
  cvRecentExperienceStyles,
} from './page.css';
import './page.mobile.css';
import { Section } from './components/Section';
import { title as pageTitle } from './content.mdx';
import { ExperienceList } from './components/Experience';
import { LanguageList } from './components/Language';
import { DegreeList } from './components/Degree.list';
import { PublicationsList } from './components/Publications.list';
import { ContentIndex } from '@/models/ContentIndex';
import { RelatedContent } from '@/components/RelatedContent';
import { redirect404 } from '@/utils/routes.ssr';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/personal/cv'>,
): Promise<Metadata> {
  const { locale } = await params;
  const cv = CVResource.fromDefault(locale);
  const availableLocales = await cv.availableLocales;
  return {
    title: pageTitle,
    ...await canonicalMetadata(
      locale,
      '/personal/cv',
      Object.fromEntries(availableLocales.map((variantLocale) => [variantLocale, '/personal/cv'])),
    ),
  };
}

export default async function CVPage({
  params,
}: PageProps<'/[locale]/personal/cv'>) {
  const [translate, showLanguageSuggestionBanner] = await Promise.all([
    getTranslations('cv'),
    experimentEnabled('languageSuggestionBanner'),
  ]);
  const { locale } = await params;
  if (!isLocale(locale)) {
    return redirect404();
  }
  const cv = CVResource.fromDefault(locale);
  const availableLocales = await cv.availableLocales;

  cv.collectTOC();

  const overview = await cv.overview;
  const {
    title, tagline, info,
  } = overview;

  const pageContent = (
    <>
      <div className={cvIntroStyles}>
        <Section name="skills">
          <Typography as="h2" tocText="Skills">
            {cv.tocSection(translate('skills'), 'Skills')}
          </Typography>
          <ExperienceList list={[{ project: { skill: await cv.skills } }] as any} />
          <Typography as="h2" tocText="Languages">
            {cv.tocSection(translate('languages'), 'Languages')}
          </Typography>
          <LanguageList list={await cv.languages} />
          <Typography as="h2" tocText="Education">
            {cv.tocSection(translate('education'), 'Education')}
          </Typography>
          <DegreeList list={await cv.filteredDegrees} />
          <Typography as="h2" tocText="Publications and Conferences">
            {cv.tocSection(translate('publications'), 'Publications and Conferences')}
          </Typography>
          <PublicationsList list={await cv.zippedPublications} />
        </Section>
        <div className={cvRecentExperienceStyles}>
          <Typography as="h2" tocText="Recent Experience">
            {cv.tocSection(translate('recentExperience'), 'Recent Experience')}
          </Typography>
          <ExperienceList list={await cv.featuredExperiences} />
        </div>
      </div>
      <Typography as="h2" tocText="Work Projects">
        {cv.tocSection(translate('workProjects'), 'Work Projects')}
      </Typography>
      <ExperienceList list={await cv.featuredWorkProjects} />
      <Grid columns={2} grid>
        <ExperienceList list={await cv.extendedWorkProjects} />
      </Grid>
      <Typography as="h2" tocText="Open Source Projects">
        {cv.tocSection(translate('openSourceProjects'), 'Open Source Projects')}
      </Typography>
      <Grid columns={2} grid>
        <ExperienceList list={await cv.opensourceProjects} />
      </Grid>
      <Typography as="h2" tocText="Personal Projects">
        {cv.tocSection(translate('personalProjects'), 'Personal Projects')}
      </Typography>
      <Grid columns={2} grid>
        <ExperienceList list={await cv.personalProjects} />
      </Grid>
      <Typography as="h2" tocText="Academic Projects">
        {cv.tocSection(translate('academicProjects'), 'Academic Projects')}
      </Typography>
      <ExperienceList list={await cv.academicProjects} />
      <Typography as="h2" tocText="Extracurricular Involvement">
        {cv.tocSection(translate('extracurricularInvolvement'), 'Extracurricular Involvement')}
      </Typography>
      <ExperienceList list={await cv.extracurricularExperiences} />
      <Typography as="h2" tocText="Competition Projects">
        {cv.tocSection(translate('competitionProjects'), 'Competition Projects')}
      </Typography>
      <ExperienceList list={await cv.competitionProjects} />
      <Typography as="h2" tocText="Extended Experience">
        {cv.tocSection(translate('extendedExperience'), 'Extended Experience')}
      </Typography>
      <ExperienceList list={await cv.extendedExperiences} />
    </>
  );

  const { toc } = cv;
  const index = await ContentIndex.forLocale(locale);
  const cvEntryIds = index.entries
    .filter(({ id }) => id.startsWith('cv:'))
    .map(({ id }) => id);

  return (
    <TOCLayout className={cvPageStyles} variant="large" maxDepth={3} toc={toc}>
      {showLanguageSuggestionBanner
        ? <LocaleSuggestionBanner pathname="/personal/cv" availableLocales={availableLocales} />
        : null}
      <header>
        <div className={cvPageBioStyles}>
          <h1>{title}</h1>
          <p>{tagline}</p>
        </div>
        <InfoTagList list={info} />
      </header>
      {pageContent}
      <RelatedContent
        locale={locale}
        entryIds={cvEntryIds}
        excludeIdPrefix="cv:"
      />
    </TOCLayout>
  );
}
