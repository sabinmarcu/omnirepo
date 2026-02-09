import type { Metadata } from 'next';
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
  filteredDegrees,
  zippedPublications,
} from '@/data/personal/cv';
import { Grid } from '@/components/Grid';
import { Typography } from '@/components/mdx/Typography';
import { InfoTagList } from './components/InfoTag';
import {
  cvPageBioStyles,
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
    <>
      <header>
        <div className={cvPageBioStyles}>
          <h1>{title}</h1>
          <p>{tagline}</p>
        </div>
      <InfoTagList list={info} />
      </header>
      <Section name="skills">
        <Typography as="h2">Skills</Typography>
        <ExperienceList list={[{ project: { skill: skills } }] as any} />
        <Typography as="h2">Languages</Typography>
        <LanguageList list={languages} />
        <Typography as="h2">Education</Typography>
        <DegreeList list={filteredDegrees} />
        <Typography as="h2">Publications and Conferences</Typography>
        <PublicationsList list={zippedPublications} />
      </Section>
      <Typography as="h2">Recent Experience</Typography>
      <ExperienceList list={featuredExperiences} />
      <br style={{
        clear: 'both',
        position: 'relative',
      }} />
      <Typography as="h2">Work Projects</Typography>
      <ExperienceList list={featuredProjects} />
      <Grid columns={2} grid>
        <ExperienceList list={extendedProjects} />
      </Grid>
      <Typography as="h2">Open Source Projects</Typography>
      <Grid columns={2} grid>
        <ExperienceList list={opensourceProjects} />
      </Grid>
      <Typography as="h2">Personal Projects</Typography>
      <Grid columns={2} grid>
        <ExperienceList list={personalProjects} />
      </Grid>
      <Typography as="h2">Academic Projects</Typography>
      <ExperienceList list={academicProjects} />
      <Typography as="h2">Extracurricular Involvement</Typography>
      <ExperienceList list={extracurricularExperiences} />
      <Typography as="h2">Competition Projects</Typography>
      <ExperienceList list={competitionProjects} />
      <Typography as="h2">Extended Experience</Typography>
      <ExperienceList list={extendedExperiences} />
    </>
  );
}