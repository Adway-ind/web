require("dotenv").config();
const db = require("./config/db");

const projectsSeed = [
  {
    slug: "lumina-cosmetics",
    title: "Lumina Cosmetics",
    category: "Visual Identity",
    year: "2024",
    client: "Lumina Beauty Inc.",
    desc: "A complete visual identity overhaul for a premium cosmetics brand seeking to elevate their market presence. We reimagined every touchpoint — from logo and packaging to retail design and digital presence — creating a cohesive luxury experience that resonates with modern beauty consumers.",
    challenge: "Lumina had strong products but a fragmented brand identity that failed to communicate their premium positioning. They needed a unified visual language that could span physical packaging, retail environments, and digital platforms while maintaining a sense of understated luxury.",
    result: "The rebrand contributed to a 40% increase in shelf appeal scores and a 28% lift in direct-to-consumer sales within the first quarter post-launch. The new identity system gave Lumina the flexibility to extend into new product lines while maintaining brand coherence.",
    tags: ["Logo Design", "Packaging", "Brand Guidelines", "Retail Design", "Typography"],
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
      "https://images.unsplash.com/photo-1487412947147-578dfb693b41?w=1200&q=80",
      "https://images.unsplash.com/photo-1512496031090-593ed6789038?w=1200&q=80",
      "https://images.unsplash.com/photo-1586495777744-4410f3223020?w=1200&q=80"
    ]
  },
  {
    slug: "techvault",
    title: "TechVault",
    category: "Brand Strategy",
    year: "2024",
    client: "TechVault Financial",
    desc: "Strategic brand positioning and identity development for a fintech startup entering a competitive market. We crafted a brand strategy that positioned TechVault as the trustworthy, human-first alternative in a sea of cold financial tech.",
    challenge: "The fintech space is crowded with look-alike brands that rely on cold, corporate aesthetics. TechVault needed to stand out by being approachable without sacrificing credibility — balancing warmth with authority.",
    result: "Within 6 months of launch, TechVault achieved 150% of their user acquisition target. Brand recall improved by 62% compared to category average, and their NPS score placed them in the top 10% of fintech brands.",
    tags: ["Strategy", "Positioning", "Naming", "Brand Architecture", "Visual Identity"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e15f92?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e15f92?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1553877522-432b601b6a6b?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8988f0e829d?w=1200&q=80",
      "https://images.unsplash.com/photo-1559526324-4b87b5e8123b?w=1200&q=80"
    ]
  },
  {
    slug: "ecogreen-living",
    title: "EcoGreen Living",
    category: "Digital Design",
    year: "2023",
    client: "EcoGreen Sustainability",
    desc: "A full digital experience design including website, app, and e-commerce platform for a sustainable living brand. The design language reflects nature-inspired minimalism with intuitive user journeys that make sustainable choices effortless.",
    challenge: "Sustainability brands often sacrifice design quality for messaging. EcoGreen needed a digital experience that was both beautiful and functional — proving that eco-conscious choices can be aspirational and accessible.",
    result: "The redesigned platform saw a 3.2x increase in conversion rate and 85% improvement in mobile engagement. Average session duration increased by 4 minutes, and cart abandonment dropped by 35%.",
    tags: ["Web Design", "App Design", "E-commerce", "UX Research", "Design System"],
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1497435334941-8c899ee2737f?w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
      "https://images.unsplash.com/photo-1532996123724-e7868c3e5437?w=1200&q=80",
      "https://images.unsplash.com/photo-1518173946687-a9c45481eff6?w=1200&q=80"
    ]
  },
  {
    slug: "artisan-coffee",
    title: "Artisan Coffee Co.",
    category: "Visual Identity",
    year: "2023",
    client: "Artisan Roasters",
    desc: "Artisanal brand identity for a specialty coffee roaster, from logo to cafe interior design concepts. The identity captures the craft and warmth of small-batch roasting while positioning Artisan as a modern, premium experience.",
    challenge: "The specialty coffee market is saturated with generic hipster aesthetics. Artisan needed a distinct visual identity that honored traditional craft while feeling fresh and contemporary — not another coffee cliché.",
    result: "Post-rebrand, Artisan opened 3 new locations with the updated design language, achieving a 45% increase in foot traffic. Their packaged coffee line grew 200% in retail distribution within 8 months.",
    tags: ["Logo Design", "Packaging", "Interior", "Typography", "Signage"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bc2035a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bc2035a5?w=1200&q=80",
      "https://images.unsplash.com/photo-1442512595490-9b4a8be7f2a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1509042239860-b1e629be2989?w=1200&q=80",
      "https://images.unsplash.com/photo-1504630083234-14087ac3fb8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1510707565282-4be8e1d698f7?w=1200&q=80"
    ]
  },
  {
    slug: "nova-fitness",
    title: "Nova Fitness",
    category: "Digital Design",
    year: "2024",
    client: "Nova Fitness Group",
    desc: "Modern digital platform and brand experience for a next-generation fitness brand. The design bridges the gap between physical training and digital wellness, creating a seamless ecosystem that motivates and empowers.",
    challenge: "Fitness apps are either too complex or too basic. Nova needed a platform that felt as dynamic and motivating as a personal training session while remaining intuitive enough for everyday use.",
    result: "The Nova app reached 100K downloads in its first month. User retention at 30 days was 3x the industry average, and premium subscription conversions exceeded targets by 180%.",
    tags: ["Web Design", "App UI/UX", "Brand System", "Motion UI", "Design System"],
    image: "https://images.unsplash.com/photo-1534438327606-49c30f3adafb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327606-49c30f3adafb?w=1200&q=80",
      "https://images.unsplash.com/photo-1571019614242-cd2acf2d2f8a?w=1200&q=80",
      "https://images.unsplash.com/photo-1540497077202-7ca9e0e0e0f0?w=1200&q=80",
      "https://images.unsplash.com/photo-1517836357263-d8a8ea83d1c0?w=1200&q=80",
      "https://images.unsplash.com/photo-1574680094628-5ed459c4637c?w=1200&q=80"
    ]
  },
  {
    slug: "skyline-realestate",
    title: "Skyline Real Estate",
    category: "Brand Strategy",
    year: "2023",
    client: "Skyline Developments",
    desc: "Premium brand strategy and identity for a luxury real estate development company. The brand exudes sophistication and confidence, targeting high-net-worth individuals seeking exclusive properties.",
    challenge: "Luxury real estate branding often defaults to gold-and-black clichés. Skyline wanted to communicate exclusivity and architectural excellence through a more refined, contemporary visual language.",
    result: "The rebrand coincided with Skyline's expansion into 2 new markets. Lead quality improved by 55%, and average property inquiry value increased by 30% — directly attributable to clearer brand positioning.",
    tags: ["Strategy", "Visual Identity", "Collateral", "Art Direction", "Print"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1560518883-ce09059f269e?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542906-20024197b3ae?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8d6fae593f?w=1200&q=80"
    ]
  },
  {
    slug: "pulse-music",
    title: "Pulse Music",
    category: "Motion Graphics",
    year: "2024",
    client: "Pulse Streaming Inc.",
    desc: "Dynamic motion identity and animated brand assets for a music streaming platform. The motion system captures the energy and rhythm of music through fluid, responsive animations that bring the brand to life.",
    challenge: "Music streaming platforms have static, interchangeable identities. Pulse needed a motion-first brand that literally pulses with the music — creating a visual experience as dynamic as the content it delivers.",
    result: "Pulse's motion identity became a defining differentiator. Social media engagement increased 85% with animated content, and the brand was featured in 3 design publications for its innovative motion system.",
    tags: ["Logo Animation", "Motion Design", "Social", "Brand Films", "UI Motion"],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a13899947557?w=1200&q=80",
      "https://images.unsplash.com/photo-1511676840522-8a0a8ea7b814?w=1200&q=80",
      "https://images.unsplash.com/photo-1514525253161-0f2442b2a3c2?w=1200&q=80",
      "https://images.unsplash.com/photo-1508700115895-7440a0a469b4?w=1200&q=80"
    ]
  },
  {
    slug: "harvest-kitchen",
    title: "Harvest Kitchen",
    category: "Visual Identity",
    year: "2023",
    client: "Harvest Restaurant Group",
    desc: "Farm-to-table restaurant brand identity with handcrafted visual elements and earthy tones. The identity tells a story of honest ingredients and community dining, with tactile design choices that feel warm and inviting.",
    challenge: "Farm-to-table branding can feel predictable with burlap textures and mason jars. Harvest needed an identity that felt authentic and artisanal without falling into rustic clichés — something modern yet grounded.",
    result: "Harvest became the highest-rated new restaurant in the city within 6 months. The branded merchandise line sold out twice, and the visual identity was adapted across 2 additional locations.",
    tags: ["Logo Design", "Menu Design", "Signage", "Packaging", "Illustration"],
    image: "https://images.unsplash.com/photo-1414235077428-33898c825008?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1414235077428-33898c825008?w=1200&q=80",
      "https://images.unsplash.com/photo-1498837167922-292e6c57e583?w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0848e993594f?w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d7666b5eb5f3?w=1200&q=80",
      "https://images.unsplash.com/photo-1476224203421-9ac33fc377c9?w=1200&q=80"
    ]
  },
  {
    slug: "vortex-gaming",
    title: "Vortex Gaming",
    category: "Motion Graphics",
    year: "2024",
    client: "Vortex Esports",
    desc: "Electrifying motion brand and visual effects for an esports and gaming community platform. The identity channels the intensity and spectacle of competitive gaming through bold, high-energy motion design.",
    challenge: "Esports brands tend to lean into aggressive, dark aesthetics. Vortex wanted something that felt powerful and competitive but also inclusive — a brand that celebrates gaming culture without gatekeeping.",
    result: "Vortex attracted 50K community members in its first quarter. The motion brand system was adopted by 12 partnered esports teams, and the platform's viewership grew 300% in 6 months.",
    tags: ["Motion Identity", "Visual Effects", "Streaming Assets", "UI Motion", "Social"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
      "https://images.unsplash.com/photo-1538481199215-7a4df6838b2a?w=1200&q=80",
      "https://images.unsplash.com/photo-1612287234866-5e15b5cc7a3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b2527c77?w=1200&q=80",
      "https://images.unsplash.com/photo-1586183043292-679bb3a2e7c3?w=1200&q=80"
    ]
  }
];

async function migrate() {
  try {
    console.log("Dropping existing projects table if any...");
    await db.query("DROP TABLE IF EXISTS projects");

    console.log("Creating projects table...");
    await db.query(`
      CREATE TABLE projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        \`desc\` TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        tags VARCHAR(255) NOT NULL,
        year VARCHAR(10) NOT NULL,
        client VARCHAR(100) NOT NULL,
        challenge TEXT NOT NULL,
        result TEXT NOT NULL,
        images TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Projects table created.");

    console.log("Seeding projects...");
    for (const p of projectsSeed) {
      await db.query(
        `INSERT INTO projects (slug, title, category, \`desc\`, image, tags, year, client, challenge, result, images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.slug,
          p.title,
          p.category,
          p.desc,
          p.image,
          p.tags.join(", "),
          p.year,
          p.client,
          p.challenge,
          p.result,
          JSON.stringify(p.images)
        ]
      );
    }
    console.log("✅ Seeding completed successfully. seeded " + projectsSeed.length + " projects.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
