export interface SocialLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Kiran C Nayak',
  monogram: 'KN',
  role: 'Software Engineer',
  tagline: 'I build backend-focused distributed systems and the APIs other teams depend on.',
  description:
    'Portfolio and blog of Kiran C Nayak, a software engineer in Bengaluru working on distributed systems and platform infrastructure. Learning is a journey, not a destination.',
  // Forwarding alias — point this at your real inbox via your domain's mail settings.
  email: 'hello@knayak.fyi',
  footerText: 'Learning is a journey, not a destination',
  socials: [
    { label: 'GitHub', href: 'https://github.com/KiranCNayak' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kirancnayak' },
    { label: 'Email', href: 'mailto:hello@knayak.fyi' },
  ] satisfies SocialLink[],
};
