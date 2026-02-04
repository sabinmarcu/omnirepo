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
import { ExperienceItemSkills } from './components/Experience.item.skills';

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
    list.map((experience) => ({
      experience,
      metadata,
    }))
  ));

const featuredExperiences = experiences
  .filter(({ experience: { featured } }) => featured)
  .sort((
    { experience: experienceA },
    { experience: experienceB },
  ) => compareTimeline(experienceA, experienceB));

const extendedExperiences = experiences
  .filter(({ experience: { featured } }) => !featured)
  .sort((
    { experience: experienceA },
    { experience: experienceB },
  ) => compareTimeline(experienceA, experienceB));

const projects = workplaces
  .flatMap(({ data: { project: list }, metadata }) => (
    list?.map((project) => ({
      project,
      metadata,
    })) ?? []
  ));

// const featuredProjects = projects
//   .filter(({ project: { featured } }) => featured)
//   .sort((
//     { project: projectA },
//     { project: projectB },
//   ) => compareTimeline(projectA, projectB));

// const extendedProjects = projects
//   .filter(({ project: { featured } }) => !featured)
//   .sort((
//     { project: projectA },
//     { project: projectB },
//   ) => compareTimeline(projectA, projectB));

export default async function CVPage() {
  return (
    <PageLayout className={cvPageStyles}>
      <Section name="bio" className={cvPageBioStyles}>
        <h1>{title}</h1>
        <p>{tagline}</p>
      </Section>
      <InfoTagList list={info} />
      <Section>
        <Section.Subsection name="recent-experience">
          <h2>Recent Experience</h2>
          <ExperienceList list={featuredExperiences} />
        </Section.Subsection>
        <Section.Subsection name="skills">
          <h2>Skills</h2>
          <ExperienceList list={[{ project: { skill: skills } }] as any} />
          {/* <h2>Languages</h2> */}
          {/* <h2>Education</h2> */}
          {/* <h2>Publications and Conferences</h2> */}
        </Section.Subsection>
      </Section>
      <Section name='extended-experience'>
        <h2>Extended Experience</h2>
        <ExperienceList list={extendedExperiences} />
      </Section>
      <Section name='work-projects'>
        <h2>Work Projects</h2>
        <ExperienceList list={projects} />
      </Section>
    </PageLayout>
  );
}
