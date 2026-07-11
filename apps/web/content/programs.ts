export type Program = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  image?: string;
};

export const programs: Program[] = [
  {
    slug: "pushpokoli-school",
    name: "Pushpokoli School",
    shortDescription: "Free education across 4 schools for underprivileged children.",
    description:
      "Pushpokoli School operates 4 educational institutions providing free, quality education to underprivileged children, following the National Curriculum and Textbook Board (NCTB) syllabus in a co-educational setting.",
    highlights: [
      "Books and learning tools provided",
      "Free uniforms",
      "Education according to NCTB curriculum",
      "Co-education",
      "Healthy food for students",
      "Support on special occasions",
    ],
  },
  {
    slug: "sponsor-a-children",
    name: "Sponsor A Children",
    shortDescription: "Sponsor a child's education and well-being for as little as 1,500৳ per month.",
    description:
      "The Sponsor A Children program connects donors directly with underprivileged children, funding their education, healthy meals, uniforms, learning materials, and holistic well-being to reduce dropout rates and build a path to a better future.",
    highlights: [
      "1,500৳ monthly sponsorship",
      "Sponsor for 1, 2, 3, or 4 years",
      "Sponsor 1 to 4 children",
      "Includes books, uniforms, healthy food, and NCTB-based education",
      "Empowerment programs for mothers",
    ],
  },
  {
    slug: "sombhabona-ict",
    name: "Sombhabona ICT",
    shortDescription: "Digital skills training to bridge the digital divide for Bangladeshi youth.",
    description:
      "The Sombhabona ICT Center equips youth with the skills needed for the modern digital economy, offering training from basic computer literacy to advanced, hands-on technical skills that prepare students for employment and further education in technology.",
    highlights: [
      "Basic computer literacy for beginners",
      "Advanced technical training for intermediate/advanced learners",
      "Hands-on, practical instruction",
      "Prepares students for employment opportunities",
    ],
  },
  {
    slug: "onindito-naree",
    name: "Onindito Naree",
    shortDescription: "Skill development and empowerment training for women.",
    description:
      "Onindito Naree ('Incomparable Woman') is a women-focused empowerment initiative that provides skill development training to help women achieve financial independence and greater participation in their communities.",
    highlights: [
      "Vocational skill training for women",
      "Focus on financial independence",
      "Community-based training sessions",
    ],
  },
  {
    slug: "sawnirvor-project",
    name: "Sawnirvor Project",
    shortDescription: "Small business support for sustainable livelihoods.",
    description:
      "The Sawnirvor ('Self-Reliant') Project supports vulnerable populations in building sustainable livelihoods through small business development, seed funding guidance, and economic empowerment.",
    highlights: [
      "Livelihood development support",
      "Small business guidance",
      "Focus on economic sustainability",
    ],
  },
  {
    slug: "amar-ghor-amar-karkhana",
    name: "Amar Ghor Amar Karkhana",
    shortDescription: "Home-based work opportunities empowering women entrepreneurs.",
    description:
      "'My Home, My Workshop' enables women to generate income through home-based enterprise work, combining flexibility with skill-building to support family income while remaining close to home.",
    highlights: [
      "Home-based income generation",
      "Skill-building for women",
      "Flexible work supporting family life",
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
