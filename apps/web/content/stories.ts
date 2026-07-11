export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
};

// The live site's "Our Stories" section has no published posts yet.
// Seed content below — replace with real success stories as they're written.
export const stories: Story[] = [
  {
    slug: "welcome-to-our-stories",
    title: "Welcome to Our Stories",
    excerpt:
      "Follow the journeys of the students, families, and communities Sombhabona works with every day.",
    content:
      "This section will feature stories from Pushpokoli School students, ICT training graduates, and women entrepreneurs supported through our programs. Check back soon for updates from the field.",
    date: "2026-01-01",
  },
];
