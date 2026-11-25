/**
 * site.ts — the single source of truth for ALL text content and contact info.
 *
 * Rules for this file:
 * - No component may hardcode copy; everything a visitor reads comes from here.
 * - Never invent statistics, testimonials, clients or certifications. Fields
 *   that still need confirmation are marked with `// VERIFY:` and should only
 *   be filled with confirmed information.
 * - Assets (images) live in /public/images and are referenced by path only.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type NavItem = { label: string; href: string };

export type ContactLink = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

export type Stat = { value: string; label: string };

export type Audience = { icon: string; title: string; description: string };

/** A small titled card with an icon and a one-line description. */
export type Feature = { icon: string; title: string; description: string };

export type Segment = {
  id: string;
  icon: string;
  title: string;
  points: string[];
};

export type ToggleTab = { id: string; label: string };

/**
 * A named technique or method.
 * `description` is optional because the marquee, the core-strength chips and
 * the About chips show only the name, while the Computational Studies page
 * shows the short description too.
 */
export type Technique = {
  /** lucide-react icon name, resolved by the UI via the icon registry. */
  icon: string;
  name: string;
  description?: string;
};

export type ServiceMedia =
  | { type?: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

export type Service = {
  /** URL segment: /services/:slug */
  slug: string;
  /** lucide-react icon name, resolved by the UI via the icon registry. */
  icon: string;
  title: string;
  tagline: string;
  /** Honest, general description. */
  description: string;
  whatYouGet: string[];
  /** Optional structured methods (name + one-line description) shown as a list. */
  techniques?: Technique[];
  process: string[];
  media?: ServiceMedia;
};

/* -------------------------------------------------------------------------- */
/* Company                                                                    */
/* -------------------------------------------------------------------------- */

export const company = {
  name: "Bio Resources Pvt Ltd",
  shortName: "Bio Resources",
  tagline: "Advanced computational and in vitro research support.",
  description:
    "Life-science research services: cell-based and in vitro studies, computational studies (docking, molecular dynamics, 3D-QSAR, DFT, machine learning, network pharmacology, immunoinformatics and vaccine designing), plus natural-molecule drugs and nanomaterial delivery.",
  /** Search keywords, mirrored into the <meta name="keywords"> tag. */
  keywords: [
    "life-science research services",
    "computational studies",
    "molecular docking",
    "molecular dynamics",
    "3D-QSAR",
    "DFT",
    "density functional theory",
    "machine learning",
    "network pharmacology",
    "immunoinformatics",
    "vaccine designing",
    "in vitro assays",
    "medicinal plants",
    "phytochemistry",
    "nanotechnology",
    "drug discovery",
  ],
  // Company logo. Lives in /public/images; the UI falls back to the text logo
  // if the file is missing. See src/components/ui/Logo.tsx.
  logo: "/images/logo.png",
  // VERIFY: set the production domain used for canonical URLs and OG tags.
  url: "https://www.example.com",
  // VERIFY: confirm against the certificate.
  registration: {
    type: "Udyam Registration",
    label: "Udyam Registered",
    number: "UDYAM-TN-20-0180589",
  },
  leadScientist: {
    // Displayed exactly as provided.
    displayName: "DR. P. PRAKASH, M.Sc., Ph.D.",
    name: "Dr. P. Prakash",
    credentials: "M.Sc., Ph.D.",
    role: "Lead Scientist",
    // VERIFY: replace with the real portrait; the UI falls back to a motif.
    photo: "/images/founder.jpg",
    bio: "Academic training and research experience across computational biology, phytochemistry, nanotechnology and pharmaceutical biology, with a focus on medicinal plants.",
  },
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The company's single contact number. Every representation of it — the
 * display string, the `tel:` link and the WhatsApp link — is derived from
 * `e164`, so the number only ever needs updating in one place.
 */
const contactNumber = {
  /** Digits only, in E.164 form without the leading "+". */
  e164: "919597118791",
  /** Human-readable form shown in the UI. */
  display: "+91 95971 18791",
};

export const contact = {
  intro:
    "Tell us about your project and we will get back to you with the right next step.",
  channels: [
    {
      id: "email",
      label: "Email",
      value: "bioresources01@gmail.com",
      href: "mailto:bioresources01@gmail.com",
    },
    {
      id: "phone",
      label: "Phone",
      value: contactNumber.display,
      href: `tel:+${contactNumber.e164}`,
    },
    // VERIFY: confirm the spelling of the location.
    {
      id: "address",
      label: "Address",
      value: "Sankagiri, Salem District, Tamil Nadu",
    },
  ] as ContactLink[],
  /** WhatsApp link for the single contact number. */
  whatsapp: `https://wa.me/${contactNumber.e164}`,
  hoursTitle: "Working hours",
  hours: "Mon–Fri, 10:00 AM – 5:30 PM", // VERIFY: confirm operating hours.
  map: {
    title: "Find us",
  },
  /** Social links. Leave empty to hide the section entirely. */
  social: [] as NavItem[],
};

/** The single phone channel, used by the navbar "Call Now" and floating call actions. */
export const primaryPhone = contact.channels.find((channel) =>
  channel.href?.startsWith("tel:"),
);

/* -------------------------------------------------------------------------- */
/* Location                                                                   */
/* -------------------------------------------------------------------------- */

export const location: Location = {
  label: company.name,
  // VERIFY: confirm the exact street address.
  address: "Sankagiri, Salem District, Tamil Nadu, India",
  // VERIFY: add the exact latitude and longitude (e.g. 11.4756 / 77.8689).
  // While both stay null the map falls back to the address above.
  lat: null,
  lng: null,
  // VERIFY: paste a Google Maps share link, or leave empty to build the link
  // from the coordinates/address above.
  mapsUrl: "",
};

/* -------------------------------------------------------------------------- */
/* Statistics (as provided)                                                   */
/* -------------------------------------------------------------------------- */

export const stats: Stat[] = [
  { value: "60", label: "Original research articles" },
  { value: "8", label: "Review papers in reputed SCI/SCIE journals" },
  { value: "148", label: "Cumulative impact factor" },
  { value: "100 ns", label: "Molecular dynamics capability" },
];

/* -------------------------------------------------------------------------- */
/* Computational techniques                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The computational methods we offer, in the order they are presented. Each
 * carries a short, general one-line description of what the study is for.
 *
 * VERIFY: owner to confirm wording and deliverables for each method below.
 */
export const computationalTechniques: Technique[] = [
  {
    icon: "puzzle",
    name: "Docking",
    description:
      "Predicts how a candidate molecule may bind to a protein target.",
  },
  {
    icon: "orbit",
    name: "Molecular Dynamics (100 ns)",
    description:
      "Simulates how a bound complex behaves over time, up to 100 ns.",
  },
  {
    icon: "trending-up",
    name: "3D-QSAR",
    description:
      "Relates the three-dimensional structure of molecules to their activity.",
  },
  {
    icon: "hexagon",
    name: "DFT",
    description:
      "Density Functional Theory — models electronic structure to study molecular reactivity.",
  },
  {
    icon: "brain",
    name: "Machine Learning",
    description:
      "Data-driven models that help predict molecular properties or activity.",
  },
  {
    icon: "network",
    name: "Network Pharmacology",
    description: "Maps how compounds act across multiple targets and pathways.",
  },
  {
    icon: "shield-plus",
    name: "Immunoinformatics",
    description: "Screens immune-relevant targets and epitopes in silico.",
  },
  {
    icon: "syringe",
    name: "Vaccine Designing",
    description:
      "Designs and evaluates candidate vaccine constructs in silico.",
  },
];

/* -------------------------------------------------------------------------- */
/* Core strength                                                              */
/* -------------------------------------------------------------------------- */

export const coreStrength = {
  title: "Our core strength",
  lead: "We help Master's and Doctoral researchers who lack access to advanced computational studies.",
  description:
    "Need-based, personalized, result-oriented solutions for academic and corporate research coordinators.",
  capabilities: computationalTechniques,
};

/* -------------------------------------------------------------------------- */
/* Who needs us                                                               */
/* -------------------------------------------------------------------------- */

export const whoNeedsUs = {
  title: "Who needs us",
  subtitle: "The researchers, institutions and companies we support.",
  items: [
    {
      icon: "pill",
      title: "Drug developers",
      description:
        "Teams developing new drugs and plant-based nanomaterial drug delivery systems.",
    },
    {
      icon: "building-2",
      title: "Research institutions",
      description:
        "Institutions that need publication-ready in vitro data for funded projects.",
    },
    {
      icon: "flask-conical",
      title: "Researchers",
      description: "Researchers who need customized in vitro assays.",
    },
    {
      icon: "leaf",
      title: "Companies",
      description:
        "Companies working in medicinal plants, botany, phytochemistry and computational biology.",
    },
  ] as Audience[],
};

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export const services: Service[] = [
  {
    slug: "in-vitro-assays",
    icon: "flask-conical",
    title: "In Vitro Assays",
    tagline: "Cell-based studies and in vitro support.",
    // VERIFY: confirm the exact assay panels offered.
    description:
      "Cell-based studies and in vitro experiments carried out to support your research question, with analysis and interpretation of the results.",
    whatYouGet: [
      "Assay support planned around your research question",
      "In vitro experiments carried out on your behalf",
      "Results with analysis and interpretation",
    ],
    process: [
      "Share your objective and the material available",
      "Agree the assay plan and scope",
      "Experiments carried out and documented",
      "Results delivered with analysis and interpretation",
    ],
    media: {
      type: "image",
      src: "/media/services/service-1.png",
      alt: "In vitro assays with laboratory cells and scientific glassware",
    },
  },
  {
    slug: "computational-studies",
    icon: "cpu",
    title: "Computational Studies",
    tagline: "Docking, molecular dynamics and beyond.",
    // VERIFY: confirm the exact methods and software used.
    description:
      "Advanced computational studies supporting structure- and molecule-based research — from docking and molecular dynamics through 3D-QSAR, DFT, machine learning, network pharmacology, immunoinformatics and vaccine designing.",
    whatYouGet: [
      "Computational studies scoped to your research question",
      "Methods run and refined on your target and molecules",
      "Results delivered with analysis and interpretation",
    ],
    // The methods offered, each with a short one-line description.
    techniques: computationalTechniques,
    process: [
      "Define the target and molecules of interest",
      "Select suitable methods for the question",
      "Run and refine the studies",
      "Deliver results with interpretation",
    ],
    media: {
      type: "image",
      src: "/media/services/service-2.png",
      alt: "Computational molecular modelling and scientific data visualisation",
    },
  },
  {
    slug: "nanotechnology-projects",
    icon: "atom",
    title: "Nanotechnology Projects",
    tagline: "Plant-based nanomaterial drug delivery.",
    // VERIFY: confirm the specific nanomaterial workflows offered.
    description:
      "Support for projects on plant-based nanomaterial drug delivery systems, from planning through to results.",
    whatYouGet: [
      "Project planning for nanomaterial drug delivery work",
      "Support through the experimental stages",
      "Results with analysis and interpretation",
    ],
    process: [
      "Share the project goal and constraints",
      "Agree the plan and scope",
      "Carry out the agreed work",
      "Deliver results with interpretation",
    ],
    media: {
      type: "image",
      src: "/media/services/service-3.png",
      alt: "Nanoparticles and nanomaterial drug delivery research",
    },
  },
  {
    slug: "projects-and-internships",
    icon: "graduation-cap",
    title: "Projects & Internships",
    tagline: "Guided project and internship support.",
    // VERIFY: confirm eligibility, duration and format.
    description:
      "Guided project and internship support for students who need help planning and completing their research work.",
    whatYouGet: [
      "Guidance on planning the project",
      "Support while the work is carried out",
      "Feedback while you work towards your submission",
    ],
    process: [
      "Discuss your project requirements",
      "Agree the scope and timeline",
      "Work through the project with guidance",
      "Review outcomes together",
    ],
    media: {
      type: "image",
      src: "/media/services/service-4.png",
      alt: "Students collaborating on a guided research project",
    },
  },
  {
    slug: "thesis-and-manuscript-writing",
    icon: "book-open",
    title: "Thesis & Manuscript Writing",
    tagline: "Help shaping your manuscripts and thesis.",
    // VERIFY: confirm the exact scope of writing support.
    description:
      "Expert help with preparing manuscripts and theses, so you keep ownership of your work while getting it into publishable shape.",
    whatYouGet: [
      "Help structuring your manuscript or thesis",
      "Support refining the writing and presentation",
      "Guidance on responding to feedback",
    ],
    process: [
      "Share your draft and target",
      "Agree the areas to work on",
      "Work through revisions together",
      "Hand back a submission-ready document",
    ],
    media: {
      type: "image",
      src: "/media/services/service-5.png",
      alt: "Scientific manuscript and thesis writing workspace",
    },
  },
];

/** Convenience lookup used by the /services/:slug route. */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Focus areas                                                                */
/* -------------------------------------------------------------------------- */

export const focusAreas = {
  eyebrow: "Focus areas",
  title: "Seven areas we work in",
  subtitle: "The areas our work centres on.",
  items: [
    {
      icon: "pill",
      title: "Drug Discovery from Natural Products",
      description: "Screening natural molecules for therapeutic potential.",
      media: {
        type: "image",
        src: "/media/cards/card-1.png",
        alt: "Glossy molecule and capsule illustration for natural-product drug discovery",
      },
    },
    {
      icon: "leaf",
      title: "Medicinal Plants",
      description: "Study of plant-derived compounds and their bioactivity.",
      media: {
        type: "image",
        src: "/media/cards/card-2.png",
        alt: "Realistic medicinal plant artwork",
      },
    },
    {
      icon: "cpu",
      title: "Computational Studies",
      description:
        "Docking, molecular dynamics and modelling that guide the bench work.",
      media: {
        type: "image",
        src: "/media/cards/card-3.png",
        alt: "Computational biology chip and molecular network illustration",
      },
    },
    {
      icon: "shield-plus",
      title: "Immunoinformatics",
      description:
        "In silico screening of immune-relevant targets and epitopes.",
      media: {
        type: "image",
        src: "/media/cards/card-4.png",
        alt: "Immune shield and antibody illustration for immunoinformatics",
      },
    },
    {
      icon: "syringe",
      title: "Vaccine Designing",
      description:
        "In silico design and evaluation of candidate vaccine constructs.",
      media: {
        type: "image",
        src: "/media/cards/card-5.png",
        alt: "Syringe, vial and vaccine particle illustration",
      },
    },
    {
      icon: "sprout",
      title: "Tissue Culture",
      description: "Cell and tissue culture work supporting in vitro studies.",
      media: {
        type: "image",
        src: "/media/cards/card-6.png",
        alt: "Petri dish and plant tissue culture illustration",
      },
    },
    {
      icon: "atom",
      title: "Nanotechnology",
      description: "Plant-based nanomaterial drug delivery systems.",
      media: {
        type: "image",
        src: "/media/cards/card-7.png",
        alt: "Nanoparticle core and electron orbit illustration",
      },
    },
  ] as FocusArea[],
};

/* -------------------------------------------------------------------------- */
/* Techniques (used by the home marquee)                                      */
/* -------------------------------------------------------------------------- */

export const techniques: Technique[] = [
  ...computationalTechniques,
  { icon: "flask-conical", name: "In Vitro Assays" },
  { icon: "sprout", name: "Tissue Culture" },
  { icon: "atom", name: "Nanotechnology" },
  { icon: "leaf", name: "Medicinal Plants" },
  { icon: "test-tube", name: "Phytochemistry" },
];

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

export const howItWorks = {
  eyebrow: "How it works",
  title: "A clear path from question to report.",
  subtitle:
    "Every project follows the same five stages, so you always know where things stand.",
  steps: [
    {
      title: "Consult",
      description:
        "We start with your research question, the material on hand and where you are currently stuck.",
    },
    {
      title: "Design the study",
      description:
        "Together we scope the methods, assays or computational runs that will answer your question.",
    },
    {
      title: "Experiment / Compute",
      description:
        "We carry out the agreed in vitro work or computational studies.",
    },
    {
      title: "Analyse",
      description:
        "Results are analysed and interpreted against your original objective.",
    },
    {
      title: "Report",
      description:
        "You receive a documented summary of the work that you can build on.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Home page                                                                  */
/* -------------------------------------------------------------------------- */

export const home = {
  hero: {
    eyebrow: "Life-sciences research services",
    title: "From idea to publication, powered by science.",
    subtitle:
      "Research support for Master's and Doctoral researchers who lack access to advanced computational studies.",
    primaryCta: { label: "Explore services", href: "/services" },
    secondaryCta: { label: "Contact us", href: "/contact" },
  },
  servicesPreview: {
    eyebrow: "Services",
    title: "Research support, end to end",
    subtitle:
      "From computational studies to in vitro work, thesis writing and internships.",
    ctaLabel: "View all services",
    ctaHref: "/services",
  },
  finalCta: {
    title: "Bring us your research question.",
    subtitle:
      "Tell us what you are working on and we will help you find the right approach.",
    cta: { label: "Get in touch", href: "/contact" },
  },
};

/* -------------------------------------------------------------------------- */
/* About page                                                                 */
/* -------------------------------------------------------------------------- */

export const about = {
  hero: {
    eyebrow: "About us",
    title: "Life-science research services, end to end.",
    subtitle: company.description,
  },
  // VERIFY: confirm the wording of the story section before launch.
  story: {
    eyebrow: "Our story",
    title: "Built around the researcher",
    paragraphs: [
      "Bio Resources supports Master's and Doctoral researchers who need access to advanced computational studies and in vitro work.",
      "We offer a full range of life-science research services focused on cell-based studies and in vitro support, alongside natural-molecule-based drugs and nanomaterial drug delivery.",
      "The work is led by a scientist with academic training and research experience across computational biology, phytochemistry, nanotechnology and pharmaceutical biology, with a focus on medicinal plants.",
    ],
    facts: [
      { label: "Focus", value: "Cell-based and in vitro studies" },
      {
        label: "Also",
        value: "Natural-molecule drugs & nanomaterial delivery",
      },
      { label: "For", value: "Master's and Doctoral researchers" },
    ],
  },
  whyChooseUs: {
    eyebrow: "Why choose us",
    title: "Why researchers work with us",
    subtitle:
      "Need-based, personalised, result-oriented support for academic and corporate research.",
    items: [
      {
        icon: "handshake",
        title: "Need-based, not packaged",
        description:
          "Every engagement starts from your research question rather than a fixed package.",
      },
      {
        icon: "cpu",
        title: "Access to advanced methods",
        description:
          "Computational studies — docking, molecular dynamics, 3D-QSAR, DFT and more — for teams that lack them.",
      },
      {
        icon: "shield-check",
        title: "Ownership stays with you",
        description: "You keep ownership of your idea and your results.",
      },
      {
        icon: "microscope",
        title: "Results you can use",
        description:
          "Findings are analysed and interpreted so they can support your thesis, manuscript or project.",
      },
    ] as Feature[],
  },
  techniques: {
    eyebrow: "Techniques",
    title: "Computational methods we work with",
    subtitle:
      "From docking and molecular dynamics to DFT, immunoinformatics and vaccine design.",
    items: computationalTechniques,
  },
  segments: {
    eyebrow: "Who we serve",
    title: "How we work with you",
    subtitle: "The same expertise, shaped around how you work.",
    tabs: [
      { id: "academicians", label: "Academicians" },
      { id: "companies", label: "Companies" },
    ] as ToggleTab[],
    items: [
      {
        id: "academicians",
        icon: "graduation-cap",
        title: "For academicians",
        points: [
          "Keep ownership of your idea",
          "Expert help with experiments and manuscripts",
          "Fewer co-authors with better publication quality",
        ],
      },
      {
        id: "companies",
        icon: "building-2",
        title: "For companies",
        points: [
          "Expert support without full-time hires",
          "Reliable results, quickly",
        ],
      },
    ] as Segment[],
  },
  strengths: {
    eyebrow: "Strengths",
    title: "Our strengths",
    subtitle: "What you can count on across an engagement.",
    items: [
      {
        icon: "test-tube",
        title: "Customised in vitro assays",
        description: "Assays planned around your specific research question.",
      },
      {
        icon: "dna",
        title: "Data analysis and interpretation",
        description:
          "Results analysed and explained in the context of your objective.",
      },
      {
        icon: "handshake",
        title: "Continuous guidance",
        description:
          "Support at each stage, from planning through to the final report.",
      },
    ] as Feature[],
  },
};

/* -------------------------------------------------------------------------- */
/* Services page                                                              */
/* -------------------------------------------------------------------------- */

export const servicesPage = {
  hero: {
    eyebrow: "Services",
    title: "What we do",
    subtitle:
      "The research services we offer. Every engagement starts with a conversation about your goals.",
  },
  focus: {
    eyebrow: focusAreas.eyebrow,
    title: "Where our work applies",
    subtitle:
      "Every service is delivered in the context of the areas our projects centre on.",
  },
  detail: {
    whatYouGetTitle: "What you get",
    methodsTitle: "Computational methods",
    processTitle: "Process",
    ctaTitle: "Have a question about this service?",
    ctaSubtitle: "Tell us what you need and we will help you scope it.",
    ctaLabel: "Get in touch",
    otherTitle: "Other services",
    backLabel: "Back to all services",
  },
};

/* -------------------------------------------------------------------------- */
/* Contact page                                                               */
/* -------------------------------------------------------------------------- */

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    title: "Start a conversation.",
    subtitle: contact.intro,
  },
  reachTitle: "Reach us",
  form: {
    title: "Send a message",
    subtitle:
      "Tell us what you are working on and we will get back to you with the right next step.",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    /** Shown under the button and again on success. */
    confirmation: "We will send you a confirmation within 24 hours.",
    requiredNote: "* Required fields",
    fields: {
      firstName: { label: "First name" },
      lastName: { label: "Last name" },
      email: { label: "Email" },
      phone: { label: "Phone" },
      service: { label: "Service of interest" },
      message: { label: "Message" },
    },
    /** Honeypot field — hidden from people, tempting to bots. */
    honeypotLabel: "Company website",
    success: {
      title: "Message on the way",
      again: "Send another message",
      /** Shown when the form falls back to opening the visitor's email app. */
      mailtoNote:
        "Your email app has been opened with the message ready to send.",
    },
    errorSummary: "Please check the highlighted fields and try again.",
  },
};

/* -------------------------------------------------------------------------- */
/* 404 page                                                                   */
/* -------------------------------------------------------------------------- */

export const notFound = {
  code: "404",
  eyebrow: "Lost molecule",
  title: "This molecule drifted off the grid.",
  subtitle:
    "The page you were looking for is not here. Let us point you back to solid ground.",
  ctaLabel: "Return home",
  secondaryCtaLabel: "Contact us",
};

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export const footer = {
  blurb: company.description,
  legal: `© ${new Date().getFullYear()} ${company.name}. All rights reserved.`,
};
