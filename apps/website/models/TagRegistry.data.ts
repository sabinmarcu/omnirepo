import type { TagRegistry } from './TagRegistry';

export const tagRegistryData = {
  lang: {
    kind: 'language',
  },
  skills: {
    kind: 'skill',
  },
  topics: {
    kind: 'topic',
  },
  academic: {
    label: 'Academic',
  },
  competition: {
    label: 'Competition',
  },
  extracurricular: {
    label: 'Extracurricular',
  },
  featured: {
    label: 'Featured',
  },
  opensource: {
    label: 'Open source',
  },
  personal: {
    label: 'Personal',
  },
  'skills:angular': {
    implies: ['topics:frontend', 'lang:typescript'],
    label: 'Angular',
  },
  'skills:angularjs': {
    implies: ['topics:frontend', 'lang:javascript'],
    label: 'AngularJS',
  },
  'skills:css3': {
    canonical: 'lang:css',
    label: 'CSS3',
  },
  'skills:graphql': {
    implies: ['topics:backend', 'lang:graphql'],
    label: 'GraphQL',
  },
  'skills:grpc': {
    implies: ['topics:backend'],
    label: 'gRPC',
  },
  'skills:html5': {
    implies: ['topics:frontend', 'lang:html'],
    label: 'HTML5',
  },
  'skills:nodejs': {
    aliases: ['node.js'],
    implies: ['topics:backend', 'lang:typescript'],
    label: 'NodeJS',
  },
  'skills:react': {
    aliases: ['reactjs'],
    implies: ['topics:frontend', 'lang:typescript'],
    label: 'React',
  },
  'skills:typescript': {
    canonical: 'lang:typescript',
    label: 'TypeScript',
  },
  'skills:vanilla-extract': {
    implies: ['topics:frontend', 'topics:styling', 'lang:css', 'lang:typescript'],
    label: 'Vanilla Extract',
  },
  'topics:backend': {
    label: 'Backend',
  },
  'topics:frontend': {
    label: 'Frontend',
  },
  'topics:styling': {
    label: 'Styling',
  },
  'lang:css': {
    label: 'CSS',
  },
  'lang:c-cpp': {
    label: 'C/C++',
  },
  'lang:graphql': {
    label: 'GraphQL',
  },
  'lang:html': {
    label: 'HTML',
  },
  'lang:javascript': {
    label: 'JavaScript',
  },
  'lang:typescript': {
    label: 'TypeScript',
  },
  'skills:c-c': {
    canonical: 'lang:c-cpp',
  },
} satisfies TagRegistry;

export const promotedTags = [
  'skills:typescript',
  'skills:react',
  'topics:frontend',
  'opensource',
] as const;
