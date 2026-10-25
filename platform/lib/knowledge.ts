export const SOURCES = [
  {
    id: "who-diet",
    title: "WHO: Healthy diet",
    url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    kind: "Public-health guidance",
    year: 2026,
    summary:
      "Describes adequacy, balance, moderation, diversity, and food safety as foundations of healthy eating.",
  },
  {
    id: "keto-review",
    title: "Patikorn et al.: Effects of ketogenic diet on health outcomes",
    url: "https://pubmed.ncbi.nlm.nih.gov/37231411/",
    kind: "Umbrella review of randomized trials",
    year: 2023,
    summary:
      "Finds some short-term metabolic benefits alongside an LDL-cholesterol increase; many associations have low-certainty evidence and long-term outcomes remain uncertain.",
  },
  {
    id: "fasting-review",
    title: "Semnani-Azad et al.: Intermittent fasting strategies",
    url: "https://www.bmj.com/content/389/bmj-2024-082007",
    kind: "Systematic review and network meta-analysis",
    year: 2025,
    summary:
      "Compares intermittent-fasting approaches with continuous energy restriction and unrestricted diets. Outcomes depend on the intervention and follow-up; a schedule alone is not a complete diet.",
  },
  {
    id: "fasting-diabetes",
    title: "NIDDK: Fasting safely with diabetes",
    url: "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/fasting-safely-with-diabetes",
    kind: "Clinical education interview",
    year: 2020,
    summary:
      "Fasting can require individualized diabetes-medication and monitoring decisions. Those changes need a treating clinician.",
  },
  {
    id: "plant-review",
    title:
      "Capodici et al.: Cardiovascular health and cancer risk associated with plant-based diets",
    url: "https://pubmed.ncbi.nlm.nih.gov/38748667/",
    kind: "Umbrella review",
    year: 2024,
    summary:
      "A synthesis of plant-based dietary research; the diet definitions and included study designs need to be considered before applying results to an individual.",
  },
  {
    id: "carnivore-review",
    title: "Lietz et al.: Carnivore diet—current evidence, benefits and risks",
    url: "https://pubmed.ncbi.nlm.nih.gov/41599961/",
    kind: "Scoping review",
    year: 2026,
    summary:
      "Identifies a small, limited-quality evidence base, possible nutrient shortfalls and lipid concerns, and insufficient evidence for long-term safety.",
  },
  {
    id: "dash",
    title: "NHLBI: DASH eating plan",
    url: "https://www.nhlbi.nih.gov/health/dash-eating-plan",
    kind: "NIH public-health guidance",
    year: 2026,
    summary:
      "A flexible eating pattern including produce, whole grains, legumes and other protein foods, with attention to sodium and saturated fat.",
  },
  {
    id: "activity",
    title: "WHO: Physical activity",
    url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    kind: "Public-health guidance",
    year: 2024,
    summary:
      "Physical activity includes everyday movement and recreation. Regular activity and muscle strengthening have health benefits; build according to ability.",
  },
  {
    id: "access",
    title: "CDC: Physical activity among adults with disabilities",
    url: "https://www.cdc.gov/disability-and-health/conditions/physical-activity.html",
    kind: "Public-health accessibility guidance",
    year: 2025,
    summary:
      "Encourages activity that fits a person’s abilities and discussion of appropriate options with their healthcare professional.",
  },
  {
    id: "energy",
    title: "Mifflin et al.: Predicting resting energy expenditure",
    url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    kind: "Prediction-equation study",
    year: 1990,
    summary:
      "An adult body-size equation for resting energy. It does not measure total daily needs or establish an individual calorie target.",
  },
] as const;
export type Guide = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  takeaway: string;
  limits: string;
  practical: string[];
  sources: string[];
  planner: string;
  review: string;
};
export const GUIDES: Guide[] = [
  {
    slug: "balanced-eating",
    title: "Balanced eating without a rigid diet",
    category: "Everyday nutrition",
    summary:
      "Build a varied eating pattern around familiar foods and practical choices.",
    takeaway:
      "A sustainable starting pattern can include grains, pulses or other protein foods, vegetables, fruit, and suitable fats.",
    limits:
      "Food needs and serving sizes differ. A plate illustration or meal draft is not a measured nutrition prescription.",
    practical: [
      "Start with meals you already know, such as dal, rice, and vegetables.",
      "Use trusted portion and ingredient information when tracking nutrients.",
      "Adjust choices for allergies, availability, and professional advice.",
    ],
    sources: ["who-diet"],
    planner: "Balanced",
    review: "Research-informed editorial summary; not clinically reviewed.",
  },
  {
    slug: "plant-based",
    title: "Plant-based, vegan and vegetarian diets",
    category: "Diet styles",
    summary:
      "Understand how plant-focused patterns differ and what thoughtful planning involves.",
    takeaway:
      "Plant-based describes a spectrum. Vegan excludes animal foods; vegetarian patterns vary, so specify eggs and dairy separately.",
    limits:
      "A label alone does not ensure nutrient adequacy. Strict exclusions need attention to reliable nutrient sources, including vitamin B12.",
    practical: [
      "Build meals around a variety of grains, beans, lentils, vegetables, and fruit.",
      "Check fortified foods and nutrient needs with a qualified dietitian when excluding whole food groups.",
      "Use preference and ingredient filters rather than assuming every plant dish fits.",
    ],
    sources: ["plant-review", "who-diet"],
    planner: "Plant-forward",
    review: "Research-informed editorial summary; not clinically reviewed.",
  },
  {
    slug: "ketogenic",
    title: "Keto diets: what the evidence can and cannot tell you",
    category: "Diet styles",
    summary:
      "Learn about ketogenic diets, their researched effects, and their limitations.",
    takeaway:
      "Ketogenic diets restrict carbohydrate substantially. Research describes benefits for some outcomes and potential trade-offs, including higher LDL cholesterol.",
    limits:
      "Short trials and mixed certainty do not establish long-term safety for everyone. Therapeutic ketogenic diets need clinical supervision.",
    practical: [
      "Read the evidence before choosing a restrictive pattern.",
      "Discuss suitability if you take medicines or have a medical condition.",
      "Our public planner provides education, not prescribed ketogenic macros or a therapeutic diet.",
    ],
    sources: ["keto-review"],
    planner: "Keto · education only",
    review: "Clinical review required before personalized ketogenic planning.",
  },
  {
    slug: "meat-forward",
    title: "Meat-forward eating and the carnivore diet are different",
    category: "Diet styles",
    summary:
      "Explore mixed meals with animal foods while understanding more restrictive approaches.",
    takeaway:
      "A meat-forward mixed pattern can still include produce, grains and pulses. Carnivore patterns exclude most or all plant foods.",
    limits:
      "Current carnivore evidence is limited and does not establish long-term safety or nutritional completeness.",
    practical: [
      "Keep dietary variety when choosing mixed meals.",
      "Separate food preference from unproven disease-treatment claims.",
      "Carnivore is available as an educational topic, not an automatic prescribed plan.",
    ],
    sources: ["carnivore-review", "who-diet"],
    planner: "Meat-forward",
    review:
      "Research-informed editorial summary; carnivore personalization is not provided.",
  },
  {
    slug: "intermittent-fasting",
    title: "Intermittent fasting is a timing pattern, not a food group",
    category: "Meal timing",
    summary:
      "Understand time-restricted eating, alternate-day approaches, and when assessment matters.",
    takeaway:
      "Fasting studies compare different schedules and energy-intake strategies. Meal quality and individual suitability remain important.",
    limits:
      "Fasting can interact with medicines and conditions. An automatic eating-window recommendation is inappropriate when a person needs clinical assessment.",
    practical: [
      "Consider whether a timing pattern fits your work, training, and wellbeing.",
      "Consult your treating clinician before fasting with diabetes or glucose-lowering medicines.",
      "Keep medication decisions and therapeutic fasting outside automated planning.",
    ],
    sources: ["fasting-review", "fasting-diabetes"],
    planner: "Balanced",
    review:
      "Research-informed editorial summary; personalized fasting schedules require review.",
  },
  {
    slug: "dash",
    title: "DASH-style meals and heart-health education",
    category: "Diet styles",
    summary:
      "A flexible pattern emphasizing variety and attention to sodium and fats.",
    takeaway:
      "DASH guidance includes produce, whole grains, legumes, appropriate dairy and protein foods, and limits on high-sodium and high-saturated-fat choices.",
    limits:
      "Medical needs, including kidney disease or medication-related considerations, can change an appropriate plan. This guide does not set your therapeutic sodium or potassium target.",
    practical: [
      "Use the NIH guide to understand the eating pattern.",
      "Compare sodium information on product labels.",
      "Our DASH-inspired meal examples are not a verified therapeutic DASH prescription.",
    ],
    sources: ["dash"],
    planner: "DASH-inspired",
    review:
      "Research-informed editorial summary; not a therapeutic prescription.",
  },
  {
    slug: "accessible-movement",
    title: "Fitness with a disability or movement limitation",
    category: "Accessible fitness",
    summary:
      "Choose functional preferences and ask for support that fits your abilities.",
    takeaway:
      "Accessible activity is individual. Seated, floor-free, low-impact, or supported options may improve practical access.",
    limits:
      "A disability label does not identify a safe exercise or load. Pain, new symptoms, and medical restrictions require qualified assessment.",
    practical: [
      "Filter by what a movement requires, rather than assumptions about a diagnosis.",
      "Use a stable setup and support appropriate to your needs.",
      "Discuss suitable types and amounts of activity with your healthcare or rehabilitation professional.",
    ],
    sources: ["access", "activity"],
    planner: "Balanced",
    review:
      "Accessibility education, not an individual rehabilitation program.",
  },
  {
    slug: "gender-and-training",
    title: "Training goals, gender and individual needs",
    category: "Training knowledge",
    summary:
      "Choose exercises by ability, goals, preferences, and relevant life-stage needs.",
    takeaway:
      "Exercise selection should respond to a person’s capabilities and goals. Gender identity alone is not an exercise restriction.",
    limits:
      "Pregnancy, postpartum recovery, hormones, injury, and medical history can require individual assessment. A sex-based energy coefficient is not a gender-based training prescription.",
    practical: [
      "Choose a target muscle group and equipment that fit your session.",
      "Progress from your own baseline rather than a gender stereotype.",
      "Get tailored assessment for life-stage or medical needs.",
    ],
    sources: ["activity", "energy"],
    planner: "Balanced",
    review: "General editorial education; specialist guidance may be needed.",
  },
];
export function sourceById(id: string) {
  return SOURCES.find((s) => s.id === id);
}
export function retrieveKnowledge(question: string) {
  const words = question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(
      (w) =>
        w.length > 2 &&
        ![
          "the",
          "for",
          "and",
          "what",
          "how",
          "can",
          "with",
          "you",
          "should",
          "does",
          "about",
        ].includes(w),
    );
  return GUIDES.map((guide) => ({
    guide,
    score: words.reduce(
      (score, w) =>
        score +
        (`${guide.title} ${guide.summary} ${guide.takeaway} ${guide.category}`
          .toLowerCase()
          .includes(w)
          ? 1
          : 0),
      0,
    ),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.guide);
}
