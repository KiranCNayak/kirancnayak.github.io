export interface Project {
  name: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
}

// PLACEHOLDER DATA — replace with your real projects in src/data/projects.ts
export const projects: Project[] = [
  {
    name: 'Placeholder Project One',
    description: 'Replace with what this project does and why it mattered — 1–2 sentences.',
    tech: ['React', 'TypeScript'],
    repo: 'https://github.com/KiranCNayak',
  },
  {
    name: 'Placeholder Project Two',
    description: 'Replace with what this project does and why it mattered — 1–2 sentences.',
    tech: ['Go', 'PostgreSQL'],
    href: 'https://example.com',
  },
  {
    name: 'Placeholder Project Three',
    description: 'Replace with what this project does and why it mattered — 1–2 sentences.',
    tech: ['React Native'],
  },
];
