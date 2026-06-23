const { getCareerJobsFromDb, careerStats, careerPerks, seedCareerJobsIfEmpty } = require("../lib/careers");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Seed on first call if empty
    await seedCareerJobsIfEmpty();

    const categories = await getCareerJobsFromDb();
    res.json({ categories, stats: careerStats, perks: careerPerks });
  } catch (err) {
    res.status(500).json({ error: "Failed to load career jobs", details: err.message });
  }
};
