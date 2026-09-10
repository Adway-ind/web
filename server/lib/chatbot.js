const supabase = require("./supabase");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";

async function fetchOpenAIChatCompletion(messages) {
  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response.";
}

function getLocalChatbotReply(message, knowledge) {
  const lower = message.toLowerCase();
  if (lower.includes("service") || lower.includes("offer") || lower.includes("what do you")) {
    return `Adway offers ${knowledge.services.join(", ")}. Each service is tailored to your business needs — from brand strategy and identity to digital product design, motion graphics, and brand growth.`;
  }
  if (lower.includes("cost") || lower.includes("price") || lower.includes("pricing") || lower.includes("how much")) {
    return "Our pricing is project-based and depends on scope, timeline, and deliverables. For the best estimate, please share more about your project so our team can tailor a proposal.";
  }
  if (lower.includes("long") || lower.includes("timeline") || lower.includes("take") || lower.includes("duration")) {
    return "Project timelines depend on the scope: identity work can take 6–8 weeks, while a full branding and digital design initiative can take 10–12 weeks or more. Let us know your goals so we can recommend the right pace.";
  }
  if (lower.includes("career") || lower.includes("job") || lower.includes("hiring") || lower.includes("apply")) {
    return `${knowledge.careers} You can review current openings on the careers page and submit your application there.`;
  }
  if (lower.includes("portfolio") || lower.includes("work") || lower.includes("projects")) {
    return "Adway creates brand-led digital experiences, identity systems, motion graphics, and product design work. Check our portfolio page to see recent projects and case studies.";
  }
  if (lower.includes("contact") || lower.includes("hire") || lower.includes("connect")) {
    return "You can reach out through the contact page, or share your project details there and our team will respond.";
  }
  return "Thanks for your question! For the most accurate answer, I recommend sharing a few details about your goals, and our team will be happy to help.";
}

async function loadChatbotKnowledge() {
  const defaultKnowledge = {
    brandName: "Adway",
    brandTagline: "Creative branding, digital design, and motion marketing that helps businesses grow.",
    description: "Adway is a creative branding studio that builds modern brands, digital products, motion experiences, and marketing design for startups and growth teams.",
    values: "Creativity, collaboration, quality, and brand-led growth.",
    services: [
      "Brand Strategy",
      "Visual Identity",
      "Digital Product Design",
      "Motion Graphics",
      "Brand Guidelines",
      "Campaign Design",
    ],
    careers: "We hire designers, strategists, marketing specialists, and creative talent. Visit the careers page for current openings and application details.",
    contact: process.env.CLIENT_URL || "http://localhost:5173",
  };

  // Try to load custom knowledge from Supabase settings
  try {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "chatbot_knowledge")
      .single();
    if (data?.value) {
      return { ...defaultKnowledge, ...data.value };
    }
  } catch {}

  return defaultKnowledge;
}

function buildChatbotSystemMessage() {
  return `You are "Adway Creative Assistant", the premium AI consultant for Adway Creations.

Your purpose is to help visitors discover the right branding, design, marketing, and development services while generating qualified leads.

PERSONALITY:
- Professional and premium
- Friendly and confident
- Short and clear responses
- Solution-focused
- Never use technical jargon unless requested

IMPORTANT RULES:
1. Keep responses under 80 words.
2. Always guide users using selectable options.
3. Never ask multiple open-ended questions.
4. Present choices as buttons whenever possible.
5. Focus on understanding business goals before discussing pricing.
6. Collect lead information naturally after identifying needs.
7. Highlight Adway Creations' expertise in:
   - Brand Strategy
   - Logo Design
   - Visual Identity
   - Website Development
   - Social Media Marketing
   - Video Production
   - Performance Marketing
8. Recommend services based on business goals.
9. If unsure, ask users to choose from predefined options.
10. Always move the conversation toward booking a consultation.

WELCOME MESSAGE:

👋 Welcome to Adway Creations.

We help businesses build memorable brands, high-performing websites, and result-driven marketing campaigns.

What would you like help with today?

[Logo Design]
[Brand Identity]
[Website Development]
[Social Media Marketing]
[Video Production]
[Marketing Strategy]

When a service is selected, continue with guided questions and progressively qualify the lead.

Once enough information is collected, ask:

"Would you like a free consultation with our team?"

[Book Consultation]
[Request Proposal]
[Talk to Expert]

Collect:
- Name
- Business Name
- Email
- Phone Number
- Project Requirements

End with:

"Thank you for choosing Adway Creations. Our team will reach out shortly with the next steps."`;
}

async function getChatbotReply(message, history = []) {
  const knowledge = await loadChatbotKnowledge();
  const messages = [
    { role: "system", content: buildChatbotSystemMessage() },
    ...history,
    { role: "user", content: message },
  ];

  if (OPENAI_API_KEY) {
    try {
      return await fetchOpenAIChatCompletion(messages);
    } catch (error) {
      console.error("OpenAI chatbot error, falling back:", error.message || error);
    }
  }

  return getLocalChatbotReply(message, knowledge);
}

async function saveChatbotEnquiry(enquiry) {
  try {
    await supabase.from("chatbot_enquiries").insert({ data: enquiry });
    // Keep only latest 200
    const { data: all } = await supabase
      .from("chatbot_enquiries")
      .select("id")
      .order("created_at", { ascending: false })
      .range(200, 200);
    if (all && all.length > 0) {
      await supabase
        .from("chatbot_enquiries")
        .delete()
        .not("id", "in", `(${all.map(e => `'${e.id}'`).join(",")})`);
    }
  } catch (err) {
    console.error("Failed to save chatbot enquiry:", err.message);
  }
}

module.exports = { getChatbotReply, saveChatbotEnquiry, loadChatbotKnowledge };
