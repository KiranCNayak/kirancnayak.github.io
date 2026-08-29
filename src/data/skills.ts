export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Go', 'Python', 'Swift'],
  },
  {
    title: 'Frontend',
    skills: ['React', 'React Native', 'Next.js', 'Redux', 'Tailwind CSS', 'Astro'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Go', 'LangGraph', 'REST APIs', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Practice',
    skills: ['Distributed systems', 'API design', 'Agile delivery', 'Git'],
  },
];
