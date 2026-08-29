export interface Project {
  name: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
  /** 16:10 thumbnail (1600x1000). Add a real screenshot when there is one. */
  image?: string;
  imageAlt?: string;
}

export const projects: Project[] = [
  {
    name: 'pdf-forge',
    description:
      'A browser-based PDF toolkit: merge, split, compress, encrypt, and convert. The engine is pdfcpu compiled from Go to WebAssembly, so files are processed on-device and never uploaded.',
    tech: ['Go', 'WebAssembly', 'React', 'TypeScript', 'pdf.js'],
    repo: 'https://github.com/KiranCNayak/pdf-forge',
  },
  {
    name: 'Planning Poker',
    description:
      'A self-hosted planning poker app for agile estimation: real-time rooms over Socket.IO, anonymous-friendly identities, and owner-based moderation.',
    tech: ['React', 'Socket.IO', 'Express', 'Prisma', 'PostgreSQL'],
    repo: 'https://github.com/KiranCNayak/planning-poker',
  },
  {
    name: 'knayak.dev',
    description:
      'This site. Astro 5 with a single WebGL island: tens of thousands of particles sampled from a photo and animated entirely in a vertex shader, over a zero-JS content layer and an Astro-collections blog.',
    tech: ['Astro', 'React Three Fiber', 'Three.js', 'Tailwind CSS', 'TypeScript'],
    href: 'https://knayak.dev',
    repo: 'https://github.com/KiranCNayak/kirancnayak.github.io',
  },
];
