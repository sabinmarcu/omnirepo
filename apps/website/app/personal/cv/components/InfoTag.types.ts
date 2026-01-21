export type InfoTagType = (
  & {
    name: string,
    text?: (input: string) => string,
    link?: (input: string) => string,
  }
  & (
    | { icon: string }
    | { iconText: string }
  )
);

const emailType = {
  name: 'email',
  // iconText: '@',
  icon: 'arweave',
  link: (mail) => `mailto:${mail}`,
} as const satisfies InfoTagType;

const locationType = {
  name: 'location',
  icon: 'home',
  link: (location) => `https://google.com/maps/place/${location}`,
} as const satisfies InfoTagType;

const linkedinType = {
  name: 'linkedin',
  icon: 'linkedin',
  text: (name) => `linkedin/${name}`,
  link: (name) => `https://linkedin.com/in/${name}`,
} as const satisfies InfoTagType;

const githubType = {
  name: 'github',
  icon: 'github',
  text: (name) => `github/${name}`,
  link: (name) => `https://github.com/${name}`,
} as const satisfies InfoTagType;

export const infoTagTypes = [
  emailType,
  locationType,
  linkedinType,
  githubType,
] as const;
