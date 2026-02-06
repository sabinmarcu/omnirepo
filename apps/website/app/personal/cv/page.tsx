import { PageLayout } from '@/layouts/PageLayout';
import type { Metadata } from 'next';
import { getTitle } from '@/app/utils/getTitle';
import {
  academicProjects,
  competitionProjects,
  extendedExperiences,
  extendedProjects,
  extracurricularExperiences,
  featuredExperiences,
  featuredProjects,
  opensourceProjects,
  overview,
  personalProjects,
} from '@/data/personal/cv';
import { Grid } from '@/components/Grid';
import { InfoTagList } from './components/InfoTag';
import {
  cvPageBioStyles,
  cvPageStyles,
} from './page.css';
import './page.mobile.css';
import { Section } from './components/Section';
import { title as pageTitle } from './content.mdx';
import { ExperienceList } from './components/Experience';
import { LanguageList } from './components/Language';

export async function generateMetadata(): Promise<Metadata> {
  return { title: getTitle('Personal', pageTitle) };
}

const {
  data: {
    title,
    tagline,
    info,
    skills,
    languages,
  },
} = overview;

export default async function CVPage() {
  return (
    <PageLayout className={cvPageStyles} variant="large">
      <div className={cvPageBioStyles}>
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>
      <InfoTagList list={info} />
      <Section name="skills">
        <h2>Skills</h2>
        <ExperienceList list={[{ project: { skill: skills } }] as any} />
        <h2>Languages</h2>
        <LanguageList list={languages} />
        {/* <h2>Education</h2> */}
        {/* <h2>Publications and Conferences</h2> */}
      </Section>
      <h2>Recent Experience</h2>
      <ExperienceList list={featuredExperiences} />
      <h2>Work Projects</h2>
      <ExperienceList list={featuredProjects} />
      <Grid columns={2} grid>
        <ExperienceList list={extendedProjects} />
      </Grid>
      <h2>Open Source Projects</h2>
      <Grid columns={2} grid>
        <ExperienceList list={opensourceProjects} />
      </Grid>
      <h2>Personal Projects</h2>
      <Grid columns={2} grid>
        <ExperienceList list={personalProjects} />
      </Grid>
      <h2>Academic Projects</h2>
      <ExperienceList list={academicProjects} />
      <h2>Extracurricular Involvement</h2>
      <ExperienceList list={extracurricularExperiences} />
      <h2>Competition Projects</h2>
      <ExperienceList list={competitionProjects} />
      <h2>Extended Experience</h2>
      <ExperienceList list={extendedExperiences} />
    </PageLayout>
  );
}
