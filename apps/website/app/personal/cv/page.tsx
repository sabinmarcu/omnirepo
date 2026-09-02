import type { Metadata } from 'next';
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

export async function generateMetadata(): Promise<Metadata> {
  return { title: pageTitle };
}

export default async function CVPage() {
  const cv = CVResource.fromDefault();

  cv.collectTOC();

  const overview = await cv.overview;
  const {
    title, tagline, info,
  } = overview;

  const pageContent = (
    <>
      <div className={cvIntroStyles}>
        <Section name="skills">
          <Typography as="h2">{cv.tocSection('Skills')}</Typography>
          <ExperienceList list={[{ project: { skill: await cv.skills } }] as any} />
          <Typography as="h2">{cv.tocSection('Languages')}</Typography>
          <LanguageList list={await cv.languages} />
          <Typography as="h2">{cv.tocSection('Education')}</Typography>
          <DegreeList list={await cv.filteredDegrees} />
          <Typography as="h2">{cv.tocSection('Publications and Conferences')}</Typography>
          <PublicationsList list={await cv.zippedPublications} />
        </Section>
        <div className={cvRecentExperienceStyles}>
          <Typography as="h2">{cv.tocSection('Recent Experience')}</Typography>
          <ExperienceList list={await cv.featuredExperiences} />
        </div>
      </div>
      <Typography as="h2">{cv.tocSection('Work Projects')}</Typography>
      <ExperienceList list={await cv.featuredWorkProjects} />
      <Grid columns={2} grid>
        <ExperienceList list={await cv.extendedWorkProjects} />
      </Grid>
      <Typography as="h2">{cv.tocSection('Open Source Projects')}</Typography>
      <Grid columns={2} grid>
        <ExperienceList list={await cv.opensourceProjects} />
      </Grid>
      <Typography as="h2">{cv.tocSection('Personal Projects')}</Typography>
      <Grid columns={2} grid>
        <ExperienceList list={await cv.personalProjects} />
      </Grid>
      <Typography as="h2">{cv.tocSection('Academic Projects')}</Typography>
      <ExperienceList list={await cv.academicProjects} />
      <Typography as="h2">{cv.tocSection('Extracurricular Involvement')}</Typography>
      <ExperienceList list={await cv.extracurricularExperiences} />
      <Typography as="h2">{cv.tocSection('Competition Projects')}</Typography>
      <ExperienceList list={await cv.competitionProjects} />
      <Typography as="h2">{cv.tocSection('Extended Experience')}</Typography>
      <ExperienceList list={await cv.extendedExperiences} />
    </>
  );

  const { toc } = cv;

  return (
    <TOCLayout className={cvPageStyles} variant="large" maxDepth={3} toc={toc}>
      <header>
        <div className={cvPageBioStyles}>
          <h1>{title}</h1>
          <p>{tagline}</p>
        </div>
        <InfoTagList list={info} />
      </header>
      {pageContent}
    </TOCLayout>
  );
}
