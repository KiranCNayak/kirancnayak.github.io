export interface SocialLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Kiran C Nayak',
  monogram: 'KN',
  role: 'Software Engineer', // PLACEHOLDER — set your actual title in src/data/site.ts
  tagline: 'I build things for the web and beyond.', // PLACEHOLDER
  description:
    'Portfolio and blog of Kiran C Nayak — software engineer. Learning is a journey, not a destination.',
  email: 'hello@knayak.dev',
  footerText: 'Learning is a journey, not a destination',
  socials: [
    { label: 'GitHub', href: 'https://github.com/KiranCNayak' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kirancnayak' }, // PLACEHOLDER — verify handle
    { label: 'Email', href: 'mailto:hello@knayak.dev' },
  ] satisfies SocialLink[],
};
