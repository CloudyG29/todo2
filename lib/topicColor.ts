const PALETTE = [
  { bar: 'bg-indigo-500', chip: 'bg-indigo-50 text-indigo-700' },
  { bar: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700' },
  { bar: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700' },
  { bar: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700' },
  { bar: 'bg-sky-500', chip: 'bg-sky-50 text-sky-700' },
  { bar: 'bg-violet-500', chip: 'bg-violet-50 text-violet-700' },
];

export function getTopicColor(topic: string) {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}