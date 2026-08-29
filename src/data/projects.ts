export interface Project {
  name: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
  /** 16:10 thumbnail. Swap the picsum placeholder for a real screenshot (1600x1000). */
  image?: string;
  imageAlt?: string;
}

// PLACEHOLDER DATA — replace with your real projects in src/data/projects.ts
export const projects: Project[] = [
  {
    name: 'Placeholder Project One',
    description: 'Replace with what this project does and why it mattered. 1-2 sentences.',
    tech: ['React', 'TypeScript'],
    repo: 'https://github.com/KiranCNayak',
    image: 'https://picsum.photos/seed/kcn-project-one/1600/1000',
    imageAlt: 'PLACEHOLDER screenshot of Placeholder Project One',
  },
  {
    name: 'Placeholder Project Two',
    description: 'Replace with what this project does and why it mattered. 1-2 sentences.',
    tech: ['Go', 'PostgreSQL'],
    href: 'https://example.com',
    image: 'https://picsum.photos/seed/kcn-project-two/1600/1000',
    imageAlt: 'PLACEHOLDER screenshot of Placeholder Project Two',
  },
  {
    name: 'Placeholder Project Three',
    description: 'Replace with what this project does and why it mattered. 1-2 sentences.',
    tech: ['React Native'],
    image: 'https://picsum.photos/seed/kcn-project-three/1600/1000',
    imageAlt: 'PLACEHOLDER screenshot of Placeholder Project Three',
  },
];
