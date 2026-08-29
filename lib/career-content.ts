// Curated career-guidance content for Career Compass. Educates students on
// paths and outlook — deliberately no college or institution recommendations
// per product scope.

export interface CareerPath {
  id: string
  title: string
  stream: "Science" | "Commerce" | "Arts" | "Any Stream"
  summary: string
  dailyWork: string
  requiredSkills: string[]
  growthOutlook: string
  typicalPathway: string
}

export const CAREER_PATHS: CareerPath[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    stream: "Science",
    summary:
      "Designing, building, and maintaining the software that runs apps, websites, and systems.",
    dailyWork:
      "Writing and reviewing code, debugging issues, collaborating with designers and product teams, and testing new features.",
    requiredSkills: ["Programming fundamentals", "Problem-solving", "Logical reasoning", "Collaboration"],
    growthOutlook:
      "One of the most consistently in-demand fields globally, driven by ongoing digitization across every industry, not just tech companies.",
    typicalPathway:
      "A bachelor's degree in Computer Science, IT, or a related engineering discipline, though many engineers also enter through self-study and coding bootcamps.",
  },
  {
    id: "data-science",
    title: "Data Science & AI",
    stream: "Science",
    summary:
      "Extracting insights from data and building the models that power recommendations, predictions, and automation.",
    dailyWork:
      "Cleaning datasets, building and testing statistical or machine learning models, and communicating findings to decision-makers.",
    requiredSkills: ["Statistics", "Programming", "Curiosity", "Clear communication"],
    growthOutlook:
      "Rapid growth as more industries adopt data-driven decision-making and AI tools; demand currently outpaces the supply of trained specialists.",
    typicalPathway:
      "A degree in Computer Science, Statistics, Mathematics, or Engineering, often paired with independent projects or specialized coursework.",
  },
  {
    id: "medicine",
    title: "Medicine",
    stream: "Science",
    summary: "Diagnosing and treating patients as a physician or surgeon.",
    dailyWork:
      "Examining patients, interpreting test results, prescribing treatment, and — depending on specialization — performing procedures or surgery.",
    requiredSkills: ["Scientific aptitude", "Empathy", "Stamina", "Decision-making under pressure"],
    growthOutlook:
      "Steady, long-term demand everywhere; the specific specialization matters more than the overall field for how competitive entry is.",
    typicalPathway:
      "A medical degree followed by supervised residency training, with the path length varying significantly by country and specialization.",
  },
  {
    id: "engineering-core",
    title: "Core Engineering (Mechanical/Civil/Electrical)",
    stream: "Science",
    summary:
      "Designing and building the physical systems, structures, and machines that power infrastructure and industry.",
    dailyWork:
      "Creating technical designs, running simulations or site inspections, and coordinating with manufacturing or construction teams.",
    requiredSkills: ["Physics and math fundamentals", "Spatial reasoning", "Attention to detail", "Project coordination"],
    growthOutlook:
      "Stable demand tied to infrastructure investment, manufacturing, and the energy transition, with strong regional variation.",
    typicalPathway: "A bachelor's degree in the relevant engineering discipline.",
  },
  {
    id: "architecture",
    title: "Architecture",
    stream: "Science",
    summary: "Designing buildings and spaces that are functional, safe, and aesthetically considered.",
    dailyWork:
      "Sketching and modeling designs, meeting with clients, and working with engineers to make sure plans are structurally sound.",
    requiredSkills: ["Design sense", "Spatial reasoning", "Technical drawing", "Client communication"],
    growthOutlook:
      "Tied to construction and urban development cycles; sustainable and adaptive-reuse design is a growing specialization.",
    typicalPathway: "A professional degree in architecture, typically followed by a licensing period.",
  },
  {
    id: "chartered-accountancy",
    title: "Chartered Accountancy & Finance",
    stream: "Commerce",
    summary: "Managing financial records, audits, tax compliance, and financial strategy for organizations.",
    dailyWork:
      "Preparing and reviewing financial statements, advising on tax and compliance, and analyzing financial performance.",
    requiredSkills: ["Numerical aptitude", "Attention to detail", "Ethics and integrity", "Analytical thinking"],
    growthOutlook:
      "Consistent demand as businesses of every size need financial compliance and strategic financial guidance.",
    typicalPathway:
      "A professional qualification (such as a chartered/certified accountancy program) often combined with a commerce degree.",
  },
  {
    id: "business-management",
    title: "Business & Management",
    stream: "Commerce",
    summary: "Running or growing a business function — operations, marketing, strategy, or general management.",
    dailyWork:
      "Setting goals and budgets, coordinating teams, analyzing performance metrics, and making operational decisions.",
    requiredSkills: ["Leadership", "Communication", "Analytical thinking", "Adaptability"],
    growthOutlook:
      "Broad and steady demand across every industry, though the field is generalist — specialization often improves outcomes.",
    typicalPathway:
      "A bachelor's degree in business, commerce, or economics, often followed later by a specialized management qualification.",
  },
  {
    id: "economics",
    title: "Economics & Public Policy",
    stream: "Commerce",
    summary: "Studying how markets, resources, and policy decisions affect people and organizations.",
    dailyWork:
      "Analyzing economic data, building models, and writing research or policy recommendations.",
    requiredSkills: ["Quantitative reasoning", "Research writing", "Critical thinking"],
    growthOutlook:
      "Steady demand in research, government, consulting, and finance; data literacy is increasingly valued in this field.",
    typicalPathway: "A bachelor's degree in economics, often followed by specialized graduate study for research or policy roles.",
  },
  {
    id: "law",
    title: "Law",
    stream: "Arts",
    summary: "Advising clients and representing them in legal matters — litigation, corporate law, or public interest work.",
    dailyWork:
      "Researching case law, drafting legal documents, advising clients, and — for litigators — arguing in court.",
    requiredSkills: ["Reading comprehension", "Argumentation", "Research", "Written communication"],
    growthOutlook:
      "Consistent demand, with strong growth in specialized areas like technology law, intellectual property, and corporate compliance.",
    typicalPathway: "A professional law degree, followed by qualifying examinations specific to the jurisdiction.",
  },
  {
    id: "design",
    title: "Design (UX/Graphic/Product)",
    stream: "Arts",
    summary: "Shaping how digital products, brands, or physical products look, feel, and function.",
    dailyWork:
      "Sketching concepts, building prototypes, testing designs with users, and iterating based on feedback.",
    requiredSkills: ["Visual sense", "Empathy for users", "Communication", "Iteration mindset"],
    growthOutlook:
      "Strong demand for digital product design (UX/UI) in particular, as more services move online.",
    typicalPathway: "A design degree or diploma, though strong portfolios can matter as much as formal credentials in this field.",
  },
  {
    id: "media-journalism",
    title: "Media & Journalism",
    stream: "Arts",
    summary: "Researching, writing, and producing news or content across print, broadcast, and digital platforms.",
    dailyWork:
      "Reporting and fact-checking stories, interviewing sources, and writing or producing content on deadline.",
    requiredSkills: ["Writing", "Curiosity", "Fact-checking rigor", "Adaptability to new formats"],
    growthOutlook:
      "Traditional roles are shifting, but demand is growing for digital-first content, video, and data journalism skills.",
    typicalPathway: "A degree in journalism, mass communication, or a related field, though a strong portfolio matters greatly.",
  },
  {
    id: "psychology",
    title: "Psychology & Counseling",
    stream: "Arts",
    summary: "Helping individuals understand and manage mental health, behavior, and relationships.",
    dailyWork:
      "Conducting assessments, running therapy sessions, and — in research roles — designing and analyzing studies.",
    requiredSkills: ["Empathy", "Active listening", "Patience", "Scientific reasoning"],
    growthOutlook:
      "Growing demand as mental health awareness increases, particularly for licensed clinical and counseling roles.",
    typicalPathway:
      "A bachelor's degree in psychology followed by specialized graduate training for clinical or counseling practice.",
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    stream: "Any Stream",
    summary: "Building and running your own venture, from an early-stage idea to a scaled business.",
    dailyWork:
      "Varies enormously — could include product development, sales, fundraising, hiring, or operations, often several in the same day.",
    requiredSkills: ["Resilience", "Resourcefulness", "Sales ability", "Comfort with uncertainty"],
    growthOutlook:
      "Not a guaranteed-outcome path — success varies widely — but the skills involved (problem-solving, adaptability) transfer well to other careers.",
    typicalPathway:
      "No fixed pathway; a foundation in business, the specific industry domain, or hands-on project experience all help.",
  },
]

export const STREAMS = ["Science", "Commerce", "Arts", "Any Stream"] as const
