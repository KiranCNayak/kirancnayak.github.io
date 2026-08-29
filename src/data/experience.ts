export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
}

// PLACEHOLDER DATA — replace with your real experience in src/data/experience.ts
export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Software Engineer',
    company: 'PLACEHOLDER Corp',
    period: '2023 - Present',
    summary: 'Replace this with a one-line summary of what you own at this job.',
    highlights: [
      'Replace with a concrete, measurable achievement.',
      'Replace with another achievement or responsibility.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'PLACEHOLDER Labs',
    period: '2020 - 2023',
    summary: 'Replace this with a one-line summary of your earlier role.',
    highlights: ['Replace with a concrete, measurable achievement.'],
  },
];
