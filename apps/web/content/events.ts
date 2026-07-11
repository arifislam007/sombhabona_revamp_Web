export type Event = {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

// The live site's Events page is currently empty — seed with a placeholder.
// Replace with real upcoming/past events.
export const events: Event[] = [
  {
    slug: "annual-education-drive",
    title: "Annual Education Drive",
    date: "2026-09-01",
    location: "Mirpur-12, Dhaka",
    description:
      "Our yearly campaign to distribute books, uniforms, and school supplies to students across all Pushpokoli School locations.",
  },
];
