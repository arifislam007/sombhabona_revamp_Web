// Sourced from the "Meet our members" section on sombhabona.org and the
// dedicated profile page at sombhabona.org/mosfeka-zannat/.
// `photo` is only set where a real photo could be found on the live site —
// everyone else falls back to an initials avatar until a real photo is supplied.
export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};

export const founder: TeamMember = {
  name: "Md Areful Islam",
  role: "Founder",
  bio: "Founded Sombhabona in 2011 and has led the organization's growth ever since, building it into a team supporting underprivileged communities across 35 districts in Bangladesh.",
};

export const team: TeamMember[] = [
  founder,
  {
    name: "Mosfeka Nishat",
    role: "Co-Founder & Communications Lead",
    bio: "Development communications specialist with 15+ years of experience in donor communications, digital storytelling, and social media engagement.",
    photo: "/team/mosfeka-nishat.png",
  },
  { name: "Al Amin Hossain", role: "Co-Founder" },
  { name: "Arefin Mahadi", role: "Co-Founder" },
  { name: "Robiul Islam Rahat", role: "Volunteer Lead" },
];
