export type Event = {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

// Verified via The Financial Express and The Daily Star — see README.
export const events: Event[] = [
  {
    slug: "pushpokoli-eid-festival-2025",
    title: "Pushpokoli Eid Festival & Iftar",
    date: "2025-03-23",
    location: "Mirpur, Dhaka",
    description:
      "Over 200 children from Pushpokoli School received gifts, festive celebrations, and iftar meals at Sombhabona's annual Eid Festival and Iftar event.",
  },
  {
    slug: "pushpokoli-winter-festival-2019",
    title: "Pushpokoli Winter Festival",
    date: "2020-01-03",
    location: "Mirpur Sher-e-Bangla National Cricket Stadium, Dhaka",
    description:
      "300 underprivileged children received winter clothes and blankets, and enjoyed pithas and a cultural show at Sombhabona's annual winter festival.",
  },
];
