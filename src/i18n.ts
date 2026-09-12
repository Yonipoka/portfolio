export type Lang = 'fr' | 'en'

export const SITE = {
  origin: 'https://yonipoka.github.io',
  base: '/portfolio/',
  get url() {
    return this.origin + this.base
  },
  name: 'John Stewart Nucum',
  email: 'johnnucum122@gmail.com',
  linkedin: 'https://www.linkedin.com/in/john-stewart-nucum-',
  github: 'https://github.com/Yonipoka',
  location: 'Genève, Suisse',
  gaMeasurementId: 'G-GWBJ6N7BLC',
}

/** Maps every page to its counterpart in the other language, for hreflang + the switcher. */
export const PAGE_MAP: Record<string, { fr: string; en: string }> = {
  home: { fr: '', en: 'en/' },
  faq: { fr: 'faq.html', en: 'en/faq.html' },
  legal: { fr: 'conditions.html', en: 'en/terms.html' },
  privacy: { fr: 'confidentialite.html', en: 'en/privacy.html' },
  notfound: { fr: '404.html', en: '404.html' },
}

export interface Fact {
  label: string
  value: string
}
export interface Project {
  id: string
  name: string
  kind: string
  year: string
  summary: string
  role: string
  roleLabel: string
  stackLabel: string
  stack: string[]
}
export interface TimelineItem {
  org: string
  place?: string
  role: string
  period: string
  points: string[]
  /** Named courses, shown only where they add something (the exchange semester). */
  courses?: string[]
}
export interface LegalDoc {
  title: string
  updated: string
  sections: { h: string; p: string[] }[]
}
export interface MetaEntry {
  title: string
  description: string
}

export interface Kinetic {
  /** Cycled through by ScrambleTextPlugin under the name. */
  roles: string[]
  /** Infinite ticker words. */
  marquee: string[]
  /** Counted up on scroll. Values must stay factually true. */
  stats: { value: string; label: string }[]
  index: { n: string; label: string }[]
}

export interface Content {
  htmlLang: string
  kinetic: Kinetic
  nav: {
    skip: string
    home: string
    about: string
    projects: string
    experience: string
    skills: string
    contact: string
    faq: string
    menu: string
    close: string
    switchTo: string
  }
  hero: {
    eyebrow: string
    name: string
    role: string
    pitch: string
    ctaPrimary: string
    ctaSecondary: string
    scroll: string
  }
  about: { title: string; lead: string; body: string[]; facts: Fact[] }
  projects: { title: string; lead: string; viewLabel: string; items: Project[] }
  experience: {
    title: string
    work: string
    education: string
    items: TimelineItem[]
    studies: TimelineItem[]
    coursesLabel: string
  }
  skills: {
    title: string
    groups: { name: string; items: string[] }[]
    languagesTitle: string
    languages: { name: string; level: string }[]
  }
  contact: {
    title: string
    lead: string
    emailLabel: string
    linkedinLabel: string
    githubLabel: string
  }
  faq: { title: string; lead: string; items: { q: string; a: string }[] }
  privacy: LegalDoc
  terms: LegalDoc
  notFound: { code: string; title: string; lead: string; cta: string; alt: string }
  cookie: {
    title: string
    body: string
    accept: string
    decline: string
    more: string
    manage: string
    savedAccepted: string
    savedDeclined: string
  }
  footer: {
    rights: string
    privacy: string
    terms: string
    faq: string
    builtWith: string
    backToTop: string
  }
  meta: {
    home: MetaEntry
    faq: MetaEntry
    privacy: MetaEntry
    terms: MetaEntry
    notfound: MetaEntry
  }
}

export const content: Record<Lang, Content> = {
  fr: {
    htmlLang: 'fr',
    kinetic: {
      roles: [
        'BUSINESS ANALYST',
        'ANALYSTE DE DONNÉES',
        'DÉVELOPPEUR FRONT-END',
        'INFORMATIQUE DE GESTION',
      ],
      marquee: [
        'REACT',
        'NEXT.JS',
        'TYPESCRIPT',
        'SQL',
        'POWER BI',
        'BPMN',
        'JAVA',
        'PYTHON',
        'TAILWIND',
        'FIGMA',
        'GIT',
        'JIRA',
      ],
      stats: [
        { value: '3', label: 'langues maternelles' },
        { value: '38', label: 'répondants à mon enquête de bachelor' },
        { value: '12', label: 'mois en organisation internationale' },
        { value: '2026', label: 'diplômé de la HEG Genève' },
      ],
      index: [
        { n: '01', label: 'PROFIL' },
        { n: '02', label: 'PROJETS' },
        { n: '03', label: 'PARCOURS' },
        { n: '04', label: 'COMPÉTENCES' },
        { n: '05', label: 'CONTACT' },
      ],
    },
    nav: {
      skip: 'Aller au contenu principal',
      home: 'Accueil',
      about: 'À propos',
      projects: 'Projets',
      experience: 'Parcours',
      skills: 'Compétences',
      contact: 'Contact',
      faq: 'FAQ',
      menu: 'Menu',
      close: 'Fermer le menu',
      switchTo: 'Switch to English',
    },
    hero: {
      eyebrow: 'Genève, Suisse',
      name: 'John Stewart Nucum',
      role: 'Business Analyst Junior · Informatique de gestion',
      pitch:
        "Diplômé d'un Bachelor HES-SO en informatique de gestion. Je travaille à l'endroit où les besoins métier rencontrent la technique : analyse, modélisation de processus, et développement web front-end.",
      ctaPrimary: 'Me contacter',
      ctaSecondary: 'Voir mes projets',
      scroll: 'Défiler',
    },
    about: {
      title: 'À propos',
      lead: "Je suis un profil hybride, et c'est assumé.",
      body: [
        "Mon parcours a commencé côté métier : un CFC d'employé de commerce et une année complète à l'Union Européenne de Radio-Télévision, à Genève, où j'ai travaillé sur des processus RH réels, des tableaux de bord Power BI et de la coordination d'équipes.",
        "Je suis ensuite passé à l'informatique de gestion à la Haute École de Gestion de Genève, avec un semestre d'échange en Corée du Sud. J'y ai appris à concevoir des systèmes d'information, à modéliser des processus en BPMN et à développer des applications web.",
        "Ce que je cherche aujourd'hui : un premier poste où je peux traduire un besoin métier en solution technique, et l'inverse.",
      ],
      facts: [
        { label: 'Nationalité', value: 'Suisse' },
        { label: 'Basé à', value: 'Genève' },
        { label: 'Diplômé en', value: 'Septembre 2026' },
        { label: 'Disponibilité', value: 'Immédiate' },
      ],
    },
    projects: {
      title: 'Projets',
      lead: 'Deux projets qui montrent les deux faces de mon profil.',
      viewLabel: 'En savoir plus sur',
      items: [
        {
          id: 'drepano',
          name: 'Plateforme Suisse Drépano',
          kind: 'Application web full-stack · Projet d’équipe (4 personnes)',
          year: '2025 – 2026',
          summary:
            "Un hub d'information pour une association suisse de patients : espace documentaire multilingue, quiz interactif, chatbot IA, newsletter et back-office d'administration.",
          role: "Développement de l'interface utilisateur et coordination de l'équipe : recueil des besoins auprès de l'association, répartition des tâches et suivi de l'avancement.",
          roleLabel: 'Mon rôle',
          stackLabel: 'Technologies',
          stack: ['Next.js 16', 'React 19', 'TypeScript 5', 'Tailwind CSS 4', 'next-intl'],
        },
        {
          id: 'thesis',
          name: 'Travail de Bachelor : patrimoine culturel des Philippines',
          kind: 'Conception de système d’information · Projet individuel',
          year: '2026',
          summary:
            "Conception d'une plateforme numérique de valorisation du patrimoine culturel régional des Philippines, de l'analyse des besoins jusqu'à l'évaluation d'un prototype.",
          role:
            "Analyse des besoins, enquête utilisateurs auprès de 38 répondants, modélisation des processus en BPMN, développement et évaluation d'un prototype. Soutenu en juillet 2026.",
          roleLabel: 'Démarche',
          stackLabel: 'Méthodes',
          stack: ['Analyse des besoins', 'BPMN', 'Enquête utilisateurs', 'Prototypage', 'Évaluation'],
        },
      ],
    },
    experience: {
      title: 'Parcours',
      work: 'Expérience',
      education: 'Formation',
      coursesLabel: 'Cours suivis',
      items: [
        {
          org: 'Union Européenne de Radio-Télévision (UER / EBU)',
          place: 'Genève',
          role: 'Stage de maturité professionnelle, ressources humaines et administration',
          period: '2020 – 2021',
          points: [
            'Analyse de données et production de tableaux de bord sous Power BI.',
            'Traitement et suivi des factures fournisseurs sur Microsoft Dynamics AX (20 factures par mois), relances des impayés.',
            "Gestion du processus de recrutement de bout en bout : publication des offres sur VacancyFiller, planification et assistance aux entretiens.",
            'Préparation des dossiers de demandes de permis de travail pour les collaborateurs internationaux.',
          ],
        },
        {
          org: 'Armée suisse',
          place: 'Payerne',
          role: "École de recrues, soldat d'aviation",
          period: '2022',
          points: ['Service militaire, 5 mois.'],
        },
      ],
      studies: [
        {
          org: 'Haute École de Gestion de Genève (HEG)',
          role: 'Bachelor of Science HES-SO en Informatique de gestion',
          period: 'Septembre 2023 – Septembre 2026',
          points: [
            'Développement logiciel, bases de données et SQL, systèmes d’information, modélisation de processus, gestion de projet IT, data mining.',
          ],
        },
        {
          org: 'Dankook University',
          role: "Semestre d'échange international, Corée du Sud",
          period: 'Février – Juillet 2025',
          points: ['Semestre complet en anglais dans un environnement académique multiculturel.'],
          courses: [
            'IT and Management',
            'International Society and Leadership',
            'Business Law',
            'Overseas Market Development',
            'Monetary and Finance',
          ],
        },
        {
          org: 'École de commerce Nicolas-Bouvier',
          role: "CFC d'employé de commerce et Maturité professionnelle commerciale bilingue",
          period: 'Août 2017 – Août 2021',
          points: [
            "Travail de maturité : optimisation du processus de recrutement à l'Union Européenne de Radio-Télévision.",
          ],
        },
      ],
    },
    skills: {
      title: 'Compétences',
      groups: [
        {
          name: 'Développement web',
          items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML / CSS'],
        },
        {
          name: 'Données et BI',
          items: ['SQL', 'Power BI', 'Excel', 'Data mining'],
        },
        {
          name: 'Autres langages',
          items: ['Java (Spring Boot)', 'Python', 'Bases de données relationnelles'],
        },
        {
          name: 'Analyse et processus',
          items: ['Recueil des besoins', 'BPMN', 'Spécifications', 'Gestion de projet'],
        },
        {
          name: 'Outils',
          items: ['Git / GitHub', 'Jira', 'Trello', 'Notion', 'Figma', 'Microsoft 365'],
        },
      ],
      languagesTitle: 'Langues',
      languages: [
        { name: 'Anglais', level: 'Langue maternelle (C2)' },
        { name: 'Français', level: 'Langue maternelle (C2)' },
        { name: 'Tagalog', level: 'Langue maternelle' },
        { name: 'Allemand', level: 'A2 (notions)' },
      ],
    },
    contact: {
      title: 'Travaillons ensemble',
      lead: "Je cherche un premier poste en analyse métier, business intelligence ou développement web, à Genève ou en environnement international. Écrivez-moi, je réponds sous 24 heures.",
      emailLabel: 'Envoyer un e-mail',
      linkedinLabel: 'Voir mon profil LinkedIn',
      githubLabel: 'Voir mon GitHub',
      },
    faq: {
      title: 'Questions fréquentes',
      lead: 'Ce que les recruteurs me demandent le plus souvent.',
      items: [
        {
          q: 'Quel type de poste cherchez-vous ?',
          a: "Un premier poste en analyse métier (business analyst), en business intelligence, en support informatique ou en développement web front-end. Mon profil est à l'intersection du métier et de la technique, et c'est là que je suis le plus utile.",
        },
        {
          q: 'Êtes-vous disponible immédiatement ?',
          a: "Oui. J'ai soutenu mon travail de bachelor en juillet 2026 et je suis disponible dès maintenant, à 80 % comme à 100 %.",
        },
        {
          q: 'Avez-vous besoin d’un permis de travail en Suisse ?',
          a: "Non. Je suis de nationalité suisse et je réside à Genève, donc aucune démarche administrative n'est nécessaire pour m'engager.",
        },
        {
          q: 'Dans quelles langues travaillez-vous ?',
          a: "L'anglais, le français et le tagalog sont mes trois langues maternelles. J'ai suivi un semestre universitaire complet en anglais en Corée du Sud. Mon allemand est de niveau A2, donc limité à des échanges simples.",
        },
        {
          q: 'Quelles technologies maîtrisez-vous vraiment ?',
          a: "En développement : React, Next.js, TypeScript et Tailwind CSS, utilisés sur un vrai projet client de bout en bout. En données : SQL et Power BI. Je connais aussi Java avec Spring Boot et Python depuis mes cours.",
        },
        {
          q: 'Quel est le meilleur moyen de vous contacter ?',
          a: "Par e-mail ou via LinkedIn. Je réponds sous 24 heures en semaine.",
        },
      ],
    },
    privacy: {
      title: 'Politique de confidentialité',
      updated: 'Dernière mise à jour : septembre 2026',
      sections: [
        {
          h: 'En résumé',
          p: [
            "Ce site est un portfolio personnel. Il ne comporte aucun formulaire, ne crée aucun compte et ne vend rien. Les seules données traitées le sont à des fins de mesure d'audience, et uniquement si vous y consentez.",
          ],
        },
        {
          h: 'Responsable du traitement',
          p: [
            "John Stewart Nucum, Genève, Suisse. Pour toute question relative à vos données : johnnucum122@gmail.com.",
          ],
        },
        {
          h: 'Hébergement',
          p: [
            "Ce site est hébergé par GitHub Pages (GitHub, Inc.). Comme tout hébergeur, GitHub enregistre techniquement les requêtes entrantes, ce qui peut inclure votre adresse IP et votre navigateur, à des fins de sécurité et de fonctionnement. Ce traitement relève de la politique de confidentialité de GitHub et échappe à mon contrôle.",
          ],
        },
        {
          h: 'Mesure d’audience',
          p: [
            "Ce site utilise Google Analytics pour comprendre combien de personnes le consultent et quelles pages les intéressent. Google Analytics dépose des cookies et traite des données qui peuvent être transférées hors de Suisse, notamment aux États-Unis.",
            "Aucun cookie de mesure d'audience n'est déposé avant votre consentement explicite. Tant que vous n'avez pas accepté, le script de Google Analytics n'est pas chargé du tout.",
            "Vous pouvez modifier ou retirer votre choix à tout moment via le lien « Préférences cookies » en bas de page.",
          ],
        },
        {
          h: 'Cookies utilisés',
          p: [
            "Un cookie technique (stocké localement dans votre navigateur) conserve votre choix en matière de consentement. Il ne contient aucune donnée personnelle et est nécessaire au fonctionnement de la bannière.",
            "Si vous acceptez la mesure d'audience, Google Analytics dépose ses propres cookies afin de distinguer les visiteurs et les sessions.",
          ],
        },
        {
          h: 'Vos droits',
          p: [
            "Conformément à la Loi fédérale suisse sur la protection des données (LPD) et, le cas échéant, au Règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition concernant vos données. Écrivez-moi à johnnucum122@gmail.com et je vous répondrai dans les meilleurs délais.",
          ],
        },
        {
          h: 'Liens externes',
          p: [
            "Ce site renvoie vers des plateformes tierces (LinkedIn, GitHub). Une fois sur ces sites, leurs propres politiques de confidentialité s'appliquent.",
          ],
        },
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      updated: 'Dernière mise à jour : septembre 2026',
      sections: [
        {
          h: 'Objet du site',
          p: [
            "Ce site est un portfolio personnel présentant le parcours, les compétences et les projets de John Stewart Nucum. Il a une finalité strictement informative, dans le cadre d'une recherche d'emploi.",
          ],
        },
        {
          h: 'Propriété intellectuelle',
          p: [
            "Les textes, la structure et le code de ce site sont la propriété de John Stewart Nucum, sauf mention contraire. Vous pouvez librement consulter et partager ces pages. Toute reproduction du contenu à des fins commerciales nécessite un accord écrit préalable.",
            "Les noms de projets, d'établissements et d'organisations cités appartiennent à leurs détenteurs respectifs et ne sont mentionnés qu'à titre descriptif.",
          ],
        },
        {
          h: 'Exactitude des informations',
          p: [
            "Les informations publiées ici sont fournies de bonne foi et tenues à jour au mieux. Elles ne constituent toutefois ni un engagement contractuel, ni une garantie. Les projets décrits sont des travaux académiques ou d'équipe, et mon rôle y est précisé honnêtement.",
          ],
        },
        {
          h: 'Limitation de responsabilité',
          p: [
            "Ce site est fourni « en l'état ». Je ne saurais être tenu responsable d'un dommage direct ou indirect résultant de son utilisation, d'une interruption de service ou d'une erreur de contenu.",
          ],
        },
        {
          h: 'Liens vers des sites tiers',
          p: [
            "Ce site contient des liens vers des plateformes externes. Je n'exerce aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.",
          ],
        },
        {
          h: 'Droit applicable',
          p: [
            "Ces conditions sont régies par le droit suisse. Le for juridique est à Genève, Suisse.",
          ],
        },
      ],
    },
    notFound: {
      code: '404',
      title: 'Cette page est introuvable',
      lead: "Le lien est peut-être cassé, ou la page a été déplacée. Rien de grave, voici par où continuer.",
      cta: "Retour à l'accueil",
      alt: 'Consulter la FAQ',
    },
    cookie: {
      title: 'Un mot sur les cookies',
      body: "J'aimerais savoir combien de personnes visitent ce site, via Google Analytics. Cela dépose des cookies. Rien n'est chargé tant que vous n'avez pas accepté, et vous pouvez changer d'avis quand vous voulez.",
      accept: 'Accepter',
      decline: 'Refuser',
      more: 'En savoir plus',
      manage: 'Préférences cookies',
      savedAccepted: 'Mesure d’audience activée.',
      savedDeclined: 'Mesure d’audience désactivée.',
    },
    footer: {
      rights: 'Tous droits réservés.',
      privacy: 'Confidentialité',
      terms: "Conditions d'utilisation",
      faq: 'FAQ',
      builtWith: 'Construit avec React, GSAP, anime.js et React Spring.',
      backToTop: 'Haut de page',
    },
    meta: {
      home: {
        title: 'John Stewart Nucum | Business Analyst Junior à Genève',
        description:
          "Portfolio de John Stewart Nucum, diplômé HES-SO en informatique de gestion à Genève. Analyse métier, business intelligence et développement web en React et Next.js.",
      },
      faq: {
        title: 'Questions fréquentes | John Stewart Nucum',
        description:
          "Disponibilité, permis de travail, langues et technologies : les réponses aux questions que les recruteurs posent le plus souvent.",
      },
      privacy: {
        title: 'Politique de confidentialité | John Stewart Nucum',
        description:
          "Comment ce portfolio traite les données de ses visiteurs : hébergement, mesure d'audience, cookies et vos droits.",
      },
      terms: {
        title: "Conditions d'utilisation | John Stewart Nucum",
        description:
          "Conditions d'utilisation du portfolio de John Stewart Nucum : propriété intellectuelle, responsabilité et droit applicable.",
      },
      notfound: {
        title: 'Page introuvable (404) | John Stewart Nucum',
        description: "Cette page n'existe pas ou a été déplacée. Retournez à l'accueil du portfolio de John Stewart Nucum, business analyst junior à Genève.",
      },
    },
  },

  en: {
    htmlLang: 'en',
    kinetic: {
      roles: [
        'BUSINESS ANALYST',
        'DATA ANALYST',
        'FRONT-END DEVELOPER',
        'INFORMATION SYSTEMS',
      ],
      marquee: [
        'REACT',
        'NEXT.JS',
        'TYPESCRIPT',
        'SQL',
        'POWER BI',
        'BPMN',
        'JAVA',
        'PYTHON',
        'TAILWIND',
        'FIGMA',
        'GIT',
        'JIRA',
      ],
      stats: [
        { value: '3', label: 'native languages' },
        { value: '38', label: 'respondents to my bachelor survey' },
        { value: '12', label: 'months in an international organisation' },
        { value: '2026', label: 'graduated from HEG Geneva' },
      ],
      index: [
        { n: '01', label: 'PROFILE' },
        { n: '02', label: 'PROJECTS' },
        { n: '03', label: 'BACKGROUND' },
        { n: '04', label: 'SKILLS' },
        { n: '05', label: 'CONTACT' },
      ],
    },
    nav: {
      skip: 'Skip to main content',
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      experience: 'Background',
      skills: 'Skills',
      contact: 'Contact',
      faq: 'FAQ',
      menu: 'Menu',
      close: 'Close menu',
      switchTo: 'Passer en français',
    },
    hero: {
      eyebrow: 'Geneva, Switzerland',
      name: 'John Stewart Nucum',
      role: 'Junior Business Analyst · Business Information Systems',
      pitch:
        'HES-SO Bachelor graduate in business information systems. I work where business needs meet technical solutions: analysis, process modelling, and front-end web development.',
      ctaPrimary: 'Get in touch',
      ctaSecondary: 'See my work',
      scroll: 'Scroll',
    },
    about: {
      title: 'About',
      lead: "I'm a hybrid profile, and that's deliberate.",
      body: [
        'My path started on the business side: a Swiss commercial apprenticeship diploma and a full year at the European Broadcasting Union in Geneva, working on real HR processes, Power BI dashboards, and team coordination.',
        'I then moved into business information systems at the Geneva School of Business Administration, including an exchange semester in South Korea. There I learned to design information systems, model processes in BPMN, and build web applications.',
        'What I am looking for now: a first role where I can turn a business need into a technical solution, and the other way around.',
      ],
      facts: [
        { label: 'Nationality', value: 'Swiss' },
        { label: 'Based in', value: 'Geneva' },
        { label: 'Graduated', value: 'September 2026' },
        { label: 'Availability', value: 'Immediate' },
      ],
    },
    projects: {
      title: 'Projects',
      lead: 'Two projects that show both sides of my profile.',
      viewLabel: 'Learn more about',
      items: [
        {
          id: 'drepano',
          name: 'Plateforme Suisse Drépano',
          kind: 'Full-stack web application · Team project (4 people)',
          year: '2025 – 2026',
          summary:
            'An information hub for a Swiss patient association: multilingual document library, interactive quiz, AI chatbot, newsletter, and an admin back-office.',
          role:
            'Front-end development and team coordination: gathering requirements from the association, splitting the work, and tracking progress.',
          roleLabel: 'My role',
          stackLabel: 'Tech stack',
          stack: ['Next.js 16', 'React 19', 'TypeScript 5', 'Tailwind CSS 4', 'next-intl'],
        },
        {
          id: 'thesis',
          name: "Bachelor's thesis: Philippine cultural heritage",
          kind: 'Information system design · Solo project',
          year: '2026',
          summary:
            'Design of a digital platform to showcase the regional cultural heritage of the Philippines, from requirements analysis through to prototype evaluation.',
          role:
            'Requirements analysis, a user survey with 38 respondents, BPMN process modelling, prototype development and evaluation. Defended in July 2026.',
          roleLabel: 'Approach',
          stackLabel: 'Methods',
          stack: ['Requirements analysis', 'BPMN', 'User survey', 'Prototyping', 'Evaluation'],
        },
      ],
    },
    experience: {
      title: 'Background',
      work: 'Experience',
      education: 'Education',
      coursesLabel: 'Courses taken',
      items: [
        {
          org: 'European Broadcasting Union (EBU)',
          place: 'Geneva',
          role: 'Vocational placement year, human resources and administration',
          period: '2020 – 2021',
          points: [
            'Data analysis and Power BI dashboard production.',
            'Supplier invoice processing and follow-up in Microsoft Dynamics AX (20 invoices per month), including chasing unpaid ones.',
            'End-to-end recruitment support: posting roles on VacancyFiller, scheduling and assisting interviews.',
            'Preparing work permit applications for international staff.',
          ],
        },
        {
          org: 'Swiss Armed Forces',
          place: 'Payerne',
          role: 'Basic training, air force soldier',
          period: '2022',
          points: ['Military service, 5 months.'],
        },
      ],
      studies: [
        {
          org: 'Geneva School of Business Administration (HEG)',
          role: 'Bachelor of Science HES-SO in Business Information Systems',
          period: 'September 2023 – September 2026',
          points: [
            'Software development, databases and SQL, information systems, process modelling, IT project management, data mining.',
          ],
        },
        {
          org: 'Dankook University',
          role: 'International exchange semester, South Korea',
          period: 'February – July 2025',
          points: ['A full semester taught in English in a multicultural academic environment.'],
          courses: [
            'IT and Management',
            'International Society and Leadership',
            'Business Law',
            'Overseas Market Development',
            'Monetary and Finance',
          ],
        },
        {
          org: 'École de commerce Nicolas-Bouvier',
          role: 'Swiss commercial diploma (CFC) and bilingual vocational baccalaureate',
          period: 'August 2017 – August 2021',
          points: [
            'Final thesis: optimising the recruitment process at the European Broadcasting Union.',
          ],
        },
      ],
    },
    skills: {
      title: 'Skills',
      groups: [
        {
          name: 'Web development',
          items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML / CSS'],
        },
        {
          name: 'Data and BI',
          items: ['SQL', 'Power BI', 'Excel', 'Data mining'],
        },
        {
          name: 'Other languages',
          items: ['Java (Spring Boot)', 'Python', 'Relational databases'],
        },
        {
          name: 'Analysis and process',
          items: ['Requirements gathering', 'BPMN', 'Specifications', 'Project management'],
        },
        {
          name: 'Tools',
          items: ['Git / GitHub', 'Jira', 'Trello', 'Notion', 'Figma', 'Microsoft 365'],
        },
      ],
      languagesTitle: 'Languages',
      languages: [
        { name: 'English', level: 'Native (C2)' },
        { name: 'French', level: 'Native (C2)' },
        { name: 'Tagalog', level: 'Native' },
        { name: 'German', level: 'A2 (basic)' },
      ],
    },
    contact: {
      title: "Let's work together",
      lead: "I'm looking for a first role in business analysis, business intelligence or web development, in Geneva or in an international environment. Drop me a line, I reply within 24 hours.",
      emailLabel: 'Send an email',
      linkedinLabel: 'View my LinkedIn profile',
      githubLabel: 'View my GitHub',
      },
    faq: {
      title: 'Frequently asked questions',
      lead: 'What recruiters ask me most often.',
      items: [
        {
          q: 'What kind of role are you looking for?',
          a: 'A first role as a business analyst, in business intelligence, IT support, or front-end web development. My profile sits at the intersection of business and technology, and that is where I am most useful.',
        },
        {
          q: 'Are you available immediately?',
          a: 'Yes. I defended my bachelor thesis in July 2026 and I am available now, at 80% or 100%.',
        },
        {
          q: 'Do you need a work permit in Switzerland?',
          a: 'No. I am a Swiss national living in Geneva, so there is no administrative process involved in hiring me.',
        },
        {
          q: 'Which languages do you work in?',
          a: 'English, French and Tagalog are all native languages for me. I completed a full university semester taught in English in South Korea. My German is at A2 level, so limited to simple exchanges.',
        },
        {
          q: 'Which technologies do you actually know?',
          a: 'For development: React, Next.js, TypeScript and Tailwind CSS, used end to end on a real client project. For data: SQL and Power BI. I also know Java with Spring Boot and Python from my coursework.',
        },
        {
          q: 'What is the best way to reach you?',
          a: 'By email or through LinkedIn. I reply within 24 hours on weekdays.',
        },
      ],
    },
    privacy: {
      title: 'Privacy policy',
      updated: 'Last updated: September 2026',
      sections: [
        {
          h: 'In short',
          p: [
            'This site is a personal portfolio. It has no forms, creates no accounts, and sells nothing. The only data processed is for audience measurement, and only if you consent to it.',
          ],
        },
        {
          h: 'Data controller',
          p: [
            'John Stewart Nucum, Geneva, Switzerland. For any question about your data: johnnucum122@gmail.com.',
          ],
        },
        {
          h: 'Hosting',
          p: [
            'This site is hosted on GitHub Pages (GitHub, Inc.). Like any web host, GitHub technically logs incoming requests, which may include your IP address and browser, for security and operational purposes. That processing falls under GitHub’s own privacy policy and is outside my control.',
          ],
        },
        {
          h: 'Audience measurement',
          p: [
            'This site uses Google Analytics to understand how many people visit and which pages interest them. Google Analytics sets cookies and processes data that may be transferred outside Switzerland, including to the United States.',
            'No analytics cookie is set before your explicit consent. Until you accept, the Google Analytics script is not loaded at all.',
            'You can change or withdraw your choice at any time through the “Cookie preferences” link in the footer.',
          ],
        },
        {
          h: 'Cookies used',
          p: [
            'One technical entry, stored locally in your browser, remembers your consent choice. It contains no personal data and is required for the banner to work.',
            'If you accept audience measurement, Google Analytics sets its own cookies to distinguish visitors and sessions.',
          ],
        },
        {
          h: 'Your rights',
          p: [
            'Under the Swiss Federal Act on Data Protection (FADP) and, where applicable, the General Data Protection Regulation (GDPR), you have the right to access, correct, erase and object to the processing of your data. Email me at johnnucum122@gmail.com and I will respond promptly.',
          ],
        },
        {
          h: 'External links',
          p: [
            'This site links to third-party platforms (LinkedIn, GitHub). Once there, their own privacy policies apply.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of use',
      updated: 'Last updated: September 2026',
      sections: [
        {
          h: 'Purpose of the site',
          p: [
            'This site is a personal portfolio presenting the background, skills and projects of John Stewart Nucum. Its purpose is strictly informational, in the context of a job search.',
          ],
        },
        {
          h: 'Intellectual property',
          p: [
            'The text, structure and code of this site belong to John Stewart Nucum unless stated otherwise. You are free to read and share these pages. Reproducing the content for commercial purposes requires prior written agreement.',
            'Project, institution and organisation names mentioned belong to their respective owners and appear here for descriptive purposes only.',
          ],
        },
        {
          h: 'Accuracy of information',
          p: [
            'The information published here is provided in good faith and kept up to date to the best of my ability. It constitutes neither a contractual commitment nor a guarantee. The projects described are academic or team work, and my role in each is stated honestly.',
          ],
        },
        {
          h: 'Limitation of liability',
          p: [
            'This site is provided "as is". I cannot be held liable for any direct or indirect damage resulting from its use, from a service interruption, or from a content error.',
          ],
        },
        {
          h: 'Third-party links',
          p: [
            'This site contains links to external platforms. I have no control over their content and accept no responsibility for it.',
          ],
        },
        {
          h: 'Governing law',
          p: ['These terms are governed by Swiss law. The place of jurisdiction is Geneva, Switzerland.'],
        },
      ],
    },
    notFound: {
      code: '404',
      title: 'This page cannot be found',
      lead: 'The link may be broken, or the page may have moved. No harm done, here is where to go next.',
      cta: 'Back to home',
      alt: 'Read the FAQ',
    },
    cookie: {
      title: 'A word about cookies',
      body: 'I would like to know how many people visit this site, using Google Analytics. That sets cookies. Nothing loads until you accept, and you can change your mind at any time.',
      accept: 'Accept',
      decline: 'Decline',
      more: 'Learn more',
      manage: 'Cookie preferences',
      savedAccepted: 'Audience measurement enabled.',
      savedDeclined: 'Audience measurement disabled.',
    },
    footer: {
      rights: 'All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms of use',
      faq: 'FAQ',
      builtWith: 'Built with React, GSAP, anime.js and React Spring.',
      backToTop: 'Back to top',
    },
    meta: {
      home: {
        title: 'John Stewart Nucum | Junior Business Analyst in Geneva',
        description:
          'Portfolio of John Stewart Nucum, HES-SO graduate in business information systems, Geneva. Business analysis, business intelligence and web development in React and Next.js.',
      },
      faq: {
        title: 'Frequently asked questions | John Stewart Nucum',
        description:
          'Availability, work permit, languages and technologies: answers to the questions recruiters ask most often.',
      },
      privacy: {
        title: 'Privacy policy | John Stewart Nucum',
        description:
          'How this portfolio handles visitor data: hosting, audience measurement, cookies and your rights.',
      },
      terms: {
        title: 'Terms of use | John Stewart Nucum',
        description:
          'Terms of use for John Stewart Nucum’s portfolio: intellectual property, liability and governing law.',
      },
      notfound: {
        title: 'Page not found (404) | John Stewart Nucum',
        description: 'This page does not exist or has been moved. Head back to the portfolio of John Stewart Nucum, junior business analyst in Geneva.',
      },
    },
  },
}
