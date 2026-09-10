const supabase = require("./supabase");

const careerStats = [
  { number: "15", label: "Team Members" },
  { number: "5", label: "Countries" },
  { number: "97%", label: "Retention Rate" },
  { number: "4.8", label: "Rating" },
];

const careerPerks = [
  { title: "Health & Wellness", desc: "Full medical, dental, vision + mental health support" },
  { title: "Flexible Hours", desc: "Async-first culture with core overlap hours" },
  { title: "Learning Budget", desc: "$2,000/year for courses, conferences & growth" },
  { title: "Remote-First", desc: "Work from anywhere. Home-office stipend included" },
  { title: "Creative Culture", desc: "Design sprints, hack days & brainstorm sessions" },
  { title: "Team Retreats", desc: "Annual offsites, free swag & latest design tools" },
];

const defaultCareerJobs = [
  {
    title: "Business Development",
    count: 3,
    roles: [
      { title: "Senior Brand Designer", location: "Remote / New York", type: "Full-time", description: "Lead brand systems, motion assets, and campaign design for flagship clients." },
      { title: "Digital Product Designer", location: "Remote / New York", type: "Full-time", description: "Design product experiences for web and mobile that elevate brand storytelling." },
      { title: "Motion Designer", location: "Remote", type: "Full-time", description: "Create motion content for digital campaigns, presentations, and immersive launches." },
    ],
  },
  {
    title: "HR and Finance",
    count: 2,
    roles: [
      { title: "Brand Strategist", location: "Remote / London", type: "Full-time", description: "Shape long-term positioning and brand storytelling across client portfolios." },
      { title: "Operations Manager", location: "New York", type: "Full-time", description: "Support growth operations, team coordination, and process optimization." },
    ],
  },
  {
    title: "Data and Analytics",
    count: 2,
    roles: [
      { title: "Content Writer", location: "Remote", type: "Part-time", description: "Write persuasive copy for brand campaigns, pitch decks, and editorial content." },
      { title: "Marketing Analyst", location: "Remote", type: "Full-time", description: "Analyze campaign performance and marketing data to drive growth decisions." },
    ],
  },
];

async function getCareerJobsFromDb() {
  const { data: jobs, error } = await supabase
    .from("career_jobs")
    .select("*")
    .order("category", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const categories = [];
  (jobs || []).forEach((job) => {
    let category = categories.find((item) => item.title === job.category);
    if (!category) {
      category = { title: job.category, roles: [] };
      categories.push(category);
    }
    category.roles.push({
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.type,
      description: job.description || "",
    });
  });

  return categories.map((category) => ({
    ...category,
    count: category.roles.length,
  }));
}

async function seedCareerJobsIfEmpty() {
  const { count } = await supabase
    .from("career_jobs")
    .select("*", { count: "exact", head: true });

  if (count > 0) return;

  const entries = defaultCareerJobs.flatMap((category) =>
    category.roles.map((role) => ({
      category: category.title,
      title: role.title,
      location: role.location,
      type: role.type,
      description: role.description || "",
    }))
  );

  for (const entry of entries) {
    await supabase.from("career_jobs").insert(entry);
  }
}

module.exports = {
  careerStats,
  careerPerks,
  defaultCareerJobs,
  getCareerJobsFromDb,
  seedCareerJobsIfEmpty,
};
