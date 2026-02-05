import { PageLayout } from '@/layouts/PageLayout';
import { parse } from 'codehike';
import type { Metadata } from 'next';
import { getTitle } from '@/app/utils/getTitle';
import Overview from './overview.mdx';
import { InfoTagList } from './components/InfoTag';
import {
  overviewSchema,
} from './schemas';
import {
  cvPageBioStyles,
  cvPageStyles,
} from './page.css';
import './page.mobile.css';
import { Section } from './components/Section';
import { title as pageTitle } from './content.mdx';
import { workplaces } from './data/workplace';
import { ExperienceList } from './components/Experience.list';
import { compareTimeline } from './utils/date';
import { Grid } from './components/Grid';

export async function generateMetadata(): Promise<Metadata> {
  return { title: getTitle('Personal', pageTitle) };
}

const parsedOverview = parse(Overview);
const {
  info,
  title,
  tagline,
  skills,
} = overviewSchema.parse(parsedOverview);

const experiences = workplaces
  .flatMap(({ data: { experience: list }, metadata }) => (
    list?.map((experience) => ({
      experience,
      metadata,
    })) ?? []
  ));

const filterExperiences = (
  input: typeof experiences,
  predicate: (input: typeof experiences[number]) => boolean,
) => (
  input.filter(predicate)
    .sort((
      { experience: experienceA },
      { experience: experienceB },
    ) => compareTimeline(experienceA, experienceB))
);

const extracurricularExperiences = filterExperiences(
  experiences,
  ({ experience: { tag } }) => tag === 'extracurricular',
);

const unknownExperiences = filterExperiences(
  experiences,
  ({ experience: { tag } }) => tag === 'unknown',
);

const featuredExperiences = filterExperiences(
  unknownExperiences,
  ({ experience: { featured } }) => featured,
);

const extendedExperiences = filterExperiences(
  unknownExperiences,
  ({ experience: { featured } }) => !featured,
);

const projects = workplaces
  .flatMap(({ data: { project: list }, metadata }) => (
    list?.map((project) => ({
      project,
      metadata,
    })) ?? []
  ));

const filterProjects = (
  input: typeof projects,
  predicate: (input: typeof projects[number]) => boolean,
) => (
  input.filter(predicate)
    .sort((
      { project: projectA },
      { project: projectB },
    ) => compareTimeline(projectA, projectB))
);

const opensourceProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'opensource'),
);

const personalProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'personal'),
);

const academicProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'academic'),
);

const competitionProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'competition'),
);

const unknownProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'unknown'),
);

const featuredProjects = filterProjects(
  unknownProjects,
  ({ project: { featured } }) => featured,
);

const extendedProjects = filterProjects(
  unknownProjects,
  ({ project: { featured } }) => !featured,
);

export default async function CVPage() {
  return (
    <PageLayout className={cvPageStyles}>
      <div className={cvPageBioStyles}>
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>
      <InfoTagList list={info} />
      <Section name="skills">
        <h2>Skills</h2>
        <ExperienceList list={[{ project: { skill: skills } }] as any} />
        {/* <h2>Languages</h2> */}
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