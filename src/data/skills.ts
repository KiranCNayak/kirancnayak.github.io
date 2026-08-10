export interface SkillGroup {
  title: string;
  skills: string[];
}

// PLACEHOLDER DATA — replace with your real skills in src/data/skills.ts
export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Go', 'Python'],
  },
  {
    title: 'Frontend',
    skills: ['React', 'React Native', 'Astro', 'Tailwind CSS'],
  },
  {
    title: 'Backend & Infra',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions'],
  },
];
