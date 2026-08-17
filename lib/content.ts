export const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'problem', label: 'Problem' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'principle', label: 'Principle' },
  { id: 'transparency', label: 'Transparency' },
  { id: 'control', label: 'Control' },
  { id: 'value', label: 'Value' },
  { id: 'positioning', label: 'Positioning' },
  { id: 'apply', label: 'Apply' },
] as const;

export const videoScenes = [
  {
    id: 'hero',
    eyebrow: 'IREX / 01',
    scrollRange: '00-01',
    title: 'Make Better Drill Decisions — Before You Drill.',
    body: 'IREX transforms fragmented exploration data into structured knowledge, enabling invariant-driven reasoning to reduce false-positive targets.',
    startFrame: '/media/frame-01-rocks.png',
    endFrame: '/media/frame-02-topography.png',
    video: '/media/01-rocks-to-topography.mp4',
    contentPosition: 'left' as const,
  },
  {
    id: 'problem',
    eyebrow: '02 / PROBLEM',
    scrollRange: '01-02',
    title: 'Data-rich. Interpretation-poor. Resource-Constrained',
    body: 'Exploration operates on sparse, indirect, and often conflicting observations. Decisions are made under noise.',
    startFrame: '/media/frame-02-topography.png',
    endFrame: '/media/frame-03-cross-section.png',
    video: '/media/02-topography-to-cross-section.mp4',
    contentPosition: 'right' as const,
  },
  {
    id: 'limitations',
    eyebrow: '03 / LIMITATIONS',
    scrollRange: '02-03',
    title: 'Patterns Don’t Equal Understanding',
    body: 'Most approaches rely on statistical patterns and assumed transferability. Correlation is mistaken for understanding.',
    startFrame: '/media/frame-03-cross-section.png',
    endFrame: '/media/frame-04-diorama.png',
    video: '/media/03-cross-section-to-diorama.mp4',
    contentPosition: 'left' as const,
  },
];

export type VideoScene = (typeof videoScenes)[number];
