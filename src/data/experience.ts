export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Software Engineer 2',
    company: 'Juniper Square',
    period: 'Oct 2025 - Present',
    summary:
      'Backend-focused distributed systems and API architecture for a private-markets fund administration platform.',
    highlights: [
      'Architected a workflow orchestration engine for complex multi-step business processes, with built-in state management, audit trails, and role-based access control.',
      'Led the technical design and rollout of a regulatory-driven permissions overhaul spanning a dozen-plus user roles, then presented it to the wider engineering org alongside Product and QA.',
      'First-prize team (2 of 23) at the 5th Annual Juniper Square Engineering Hackathon, 2026.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Blue Yonder',
    period: 'Oct 2023 - Oct 2025',
    summary:
      'Internal platform work and product features for Luminate Control Tower, a supply-chain visibility product.',
    highlights: [
      'Key contributor on an internal AI agentic-workflow platform: LangGraph orchestration, a Python backend, and a Next.js + Tailwind front end, with connectors for databases, vector stores, APIs, and email.',
      'Shipped features for Luminate Control Tower as part of an Agile team in the Customer Experience org, starting as a Technical Consultant on the Cloud team.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Quicken',
    period: '2019 - 2021',
    summary:
      'Mobile development for Simplifi by Quicken across React Native, iOS, and Android, from intern to full-time engineer.',
    highlights: [
      'Implemented Redux and restructured navigation with modal-style flows across major sections of the Simplifi app.',
      'Built the "automatic lock after a user-specified delay" feature for Android and iOS, including native iOS work in Swift and a reusable radio-button component.',
      'Prototyped a referral feature at the internal hackathon with an Express.js mock backend.',
    ],
  },
];
