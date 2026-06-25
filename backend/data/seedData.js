export const assessmentQuestions = [
  {
    id: 1,
    question: "How do you prefer to solve problems?",
    options: [
      { text: "Writing code, analyzing logic, and building digital tools", points: { engineering: 4, research: 2 } },
      { text: "Analyzing financial trends, balancing budgets, or modeling markets", points: { finance: 4, management: 2 } },
      { text: "Creating layouts, designing logos, or sketching visual graphics", points: { design: 4, marketing: 2 } },
      { text: "Helping people resolve personal challenges, teaching, or advising", points: { counseling: 4, management: 2 } }
    ]
  },
  {
    id: 2,
    question: "Which work environment sounds most appealing to you?",
    options: [
      { text: "A quiet space focused on research, analysis, and data systems", points: { research: 4, engineering: 2 } },
      { text: "A collaborative startup setting where roles and designs evolve rapidly", points: { design: 3, marketing: 3 } },
      { text: "A corporate boardroom pitching financial strategies and business deals", points: { finance: 4, management: 3 } },
      { text: "A community center, hospital, or university campus guiding others", points: { counseling: 4 } }
    ]
  },
  {
    id: 3,
    question: "When working on a group project, which role do you naturally fall into?",
    options: [
      { text: "The developer/builder who implements the technical backend", points: { engineering: 4 } },
      { text: "The project coordinator who manages deadlines, budget, and scope", points: { management: 4, finance: 2 } },
      { text: "The presenter who crafts the pitch, design slides, and marketing story", points: { marketing: 4, design: 2 } },
      { text: "The mediator who keeps the team happy and resolves disputes", points: { counseling: 4 } }
    ]
  },
  {
    id: 4,
    question: "What type of articles, videos, or news do you consume in your free time?",
    options: [
      { text: "AI developments, coding tutorials, and new open-source software", points: { engineering: 4, research: 2 } },
      { text: "UI/UX case studies, logo designs, typography, and visual artwork", points: { design: 4, marketing: 1 } },
      { text: "Stock market updates, economic cycles, and venture capital rounds", points: { finance: 4, management: 2 } },
      { text: "Psychology studies, mental health, career advice, and human relationships", points: { counseling: 4 } }
    ]
  }
];

export const industries = [
  {
    id: "engineering",
    name: "Software Engineering & Tech",
    description: "Design, build, test, and maintain software applications and systems. Includes frontend, backend, mobile development, cloud architecture, and AI engineering.",
    salaryRange: "$85,000 - $185,000",
    jobOutlook: "Highly Favorable (+25% growth)",
    commonRoles: ["Frontend Developer", "Backend Engineer", "Data Scientist", "Cloud Architect", "AI Research Scientist"],
    requiredSkills: ["JavaScript", "Python", "Data Structures", "System Design", "Databases"]
  },
  {
    id: "finance",
    name: "Finance & Investment Banking",
    description: "Manage capital, perform market analysis, structure mergers, and evaluate investments. Highly numbers-driven and client-oriented.",
    salaryRange: "$75,000 - $220,000",
    jobOutlook: "Moderate (+8% growth)",
    commonRoles: ["Financial Analyst", "Investment Banker", "Portfolio Manager", "Risk Consultant"],
    requiredSkills: ["Financial Modeling", "Excel Mastery", "Corporate Valuation", "Macroeconomics"]
  },
  {
    id: "design",
    name: "UI/UX & Product Design",
    description: "Research user behaviors, wireframe application layouts, design interfaces, and build high-fidelity interactive prototypes.",
    salaryRange: "$65,000 - $140,000",
    jobOutlook: "Favorable (+16% growth)",
    commonRoles: ["UI Designer", "UX Researcher", "Product Designer", "Creative Director"],
    requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Visual Hierarchy"]
  },
  {
    id: "marketing",
    name: "Digital Marketing & Brand Strategy",
    description: "Manage campaigns, analyze social media trends, design content strategies, and build public relations for brands.",
    salaryRange: "$55,000 - $110,000",
    jobOutlook: "Moderate (+10% growth)",
    commonRoles: ["SEO Specialist", "Social Media Manager", "Growth Marketer", "Brand Strategist"],
    requiredSkills: ["Google Analytics", "Content Writing", "Copywriting", "SEO", "A/B Testing"]
  },
  {
    id: "counseling",
    name: "Human Resources & Career Counseling",
    description: "Recruit talent, coordinate career services, guide student growth, and provide mental health or professional coaching.",
    salaryRange: "$50,000 - $95,000",
    jobOutlook: "Stable (+7% growth)",
    commonRoles: ["Talent Acquisition Specialist", "HR Generalist", "Career Counselor", "Academic Advisor"],
    requiredSkills: ["Active Listening", "Conflict Resolution", "Public Speaking", "ATS Software"]
  }
];

export const skillCourses = [
  {
    id: "resume-writing",
    title: "Resume & Cover Letter Mastery",
    category: "Job Hunting",
    instructor: "Sarah Jenkins, Career Counselor",
    duration: "2 hours",
    description: "Learn how to format, structure, and tailor your resume to pass Applicant Tracking Systems (ATS) and catch recruiter attention.",
    lessons: [
      { title: "ATS Mechanics & Keyboards", duration: "15m" },
      { title: "Action Verbs & Quantifiable Results", duration: "25m" },
      { title: "Formatting for Professional Elegance", duration: "20m" },
      { title: "Tailoring to Specific Job Descriptions", duration: "30m" }
    ],
    quiz: {
      question: "Which of the following describes the best way to write a resume bullet point?",
      options: [
        "Responsible for handling customer issues and maintaining databases.",
        "Increased query response speed by 35% by implementing a Redis caching layer.",
        "Worked on a coding team that developed a website for campus housing.",
        "Completed all tasks given by my team lead in a timely manner."
      ],
      answerIndex: 1
    },
    badge: "Resume Master"
  },
  {
    id: "interviewing",
    title: "Cracking the Tech & Behavioral Interview",
    category: "Interview Prep",
    instructor: "David Vance, Tech Recruiter",
    duration: "3.5 hours",
    description: "Step-by-step guidance on structuring behavioral responses (STAR method) and whiteboarding technical software coding puzzles.",
    lessons: [
      { title: "The STAR Framework for Behaviors", duration: "30m" },
      { title: "Handling Critical Technical Puzzles", duration: "45m" },
      { title: "Questions You MUST Ask Your Interviewer", duration: "20m" },
      { title: "Salary Negotiation 101", duration: "30m" }
    ],
    quiz: {
      question: "What does the 'STAR' framework in behavioral interviewing stand for?",
      options: [
        "Start, Talk, Answer, Review",
        "Situation, Task, Action, Result",
        "Strategy, Time, Analytics, Response",
        "Skill, Training, Achievement, Recommendation"
      ],
      answerIndex: 1
    },
    badge: "Interview Guru"
  },
  {
    id: "public-speaking",
    title: "Public Speaking & Presentation Skills",
    category: "Communication",
    instructor: "Dr. Amanda Ross, Communication Lead",
    duration: "1.5 hours",
    description: "Overcome stage fright, master vocal modulation, and deliver engaging presentations that hook your audience.",
    lessons: [
      { title: "Controlling Stage Anxiety", duration: "20m" },
      { title: "Pitch Modulation & Voice Pacing", duration: "25m" },
      { title: "Crafting High-Impact Slide Decks", duration: "30m" }
    ],
    quiz: {
      question: "What is the recommended rule for text content on slides?",
      options: [
        "Fill every corner with bullet points so the audience can read along.",
        "Keep text sparse, focusing on a single big idea per slide backed by visual cues.",
        "Always use bright rainbow colors to attract interest.",
        "Copy-paste the complete paragraph from your script."
      ],
      answerIndex: 1
    },
    badge: "Master Presenter"
  }
];

export const sampleJobs = [
  {
    title: "Software Engineering Intern (Summer 2027)",
    company: "Google",
    location: "Mountain View, CA (Hybrid)",
    salary: "$45 - $60 / hour",
    type: "Internship",
    description: "Join the Google Cloud team to design and build APIs, database services, and modern frontend dashboards. You will work with a senior mentor, attend workshops, and build features shipped directly to production.",
    requirements: "Currently pursuing a BS/MS in Computer Science or related fields. Experience with JavaScript, React, Python, or Go.",
    industry: "engineering"
  },
  {
    title: "Investment Banking Analyst",
    company: "Goldman Sachs",
    location: "New York, NY",
    salary: "$110,000 - $130,000 / year",
    type: "Full-Time",
    description: "Support corporate clients in underwriting, capital raising, corporate valuations, and mergers & acquisitions (M&A). Must have strong mathematical and structural analytical capabilities.",
    requirements: "BS/BA in Finance, Economics, Mathematics or similar. High proficiency in Microsoft Excel and financial modeling.",
    industry: "finance"
  },
  {
    title: "UX Design Intern",
    company: "Figma",
    location: "San Francisco, CA",
    salary: "$35 - $48 / hour",
    type: "Internship",
    description: "Work side-by-side with product designers, developers, and researchers. Create wireframes, interactive web components, and perform usability studies.",
    requirements: "Background in UI/UX Design, Human-Computer Interaction, or Graphic Design. Portfolio showing user research and visual designs.",
    industry: "design"
  },
  {
    title: "Growth Marketing Specialist",
    company: "Stripe",
    location: "Remote",
    salary: "$85,000 - $105,000 / year",
    type: "Full-Time",
    description: "Help scale our developer tools ecosystem. Manage growth campaigns, search engine optimization (SEO), and perform A/B testing on pricing pages.",
    requirements: "2+ years of marketing/growth experience, proficiency in Google Analytics, SEO tools, and copy drafting.",
    industry: "marketing"
  }
];

export const sampleAlumni = [
  {
    name: "Alex Rivera",
    email: "alex.rivera@alumni.edu",
    password: "password123",
    role: "alumni",
    profile: {
      company: "Google",
      title: "Senior Software Engineer",
      industry: "engineering",
      graduationYear: "2021",
      isMentor: true,
      bio: "Former CS major. Passionate about helping students break into tech, review resume structures, and run mock coding interviews.",
      skills: ["React", "System Design", "Node.js", "Algorithms"],
      interests: ["Tech", "Open Source", "Gaming"],
      mentorBio: "I offer weekly mock interviews and resume reviews. Happy to connect!"
    }
  },
  {
    name: "Jessica Chen",
    email: "jessica.chen@alumni.edu",
    password: "password123",
    role: "alumni",
    profile: {
      company: "J.P. Morgan",
      title: "VP Investment Banking",
      industry: "finance",
      graduationYear: "2018",
      isMentor: true,
      bio: "Finance and Econ graduate. Happy to assist with financial modeling guidance, interview preps, and Wall Street networking tips.",
      skills: ["Financial Analysis", "Mergers & Acquisitions", "Valuation"],
      interests: ["Finance", "Golf", "Traveling"],
      mentorBio: "Can schedule chats about investment banking career tracks and interview preparation."
    }
  },
  {
    name: "Marcus Vance",
    email: "marcus.vance@alumni.edu",
    password: "password123",
    role: "alumni",
    profile: {
      company: "Airbnb",
      title: "Lead Product Designer",
      industry: "design",
      graduationYear: "2020",
      isMentor: true,
      bio: "Dedicated designer focused on user research and design systems. Let's optimize your Figma portfolios!",
      skills: ["Figma", "UX Research", "Wireframing", "Interaction Design"],
      interests: ["Art", "Photography", "Travel"],
      mentorBio: "I can help review design portfolios and discuss career paths in UI/UX."
    }
  }
];

export const sampleBooks = [
  {
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest & Stein",
    subject: "Computer Science",
    condition: "Good",
    price: 500,
    listingType: "Sale",
    sellerName: "Rahul Sharma",
    sellerEmail: "rahul@campus.edu",
    available: true
  },
  {
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    subject: "Economics",
    condition: "Excellent",
    price: 0,
    listingType: "Free",
    sellerName: "Priya Nair",
    sellerEmail: "priya@campus.edu",
    available: true
  },
  {
    title: "Organic Chemistry (8th Ed)",
    author: "Paula Bruice",
    subject: "Chemistry",
    condition: "Fair",
    price: 350,
    listingType: "Sale",
    sellerName: "Ananya Singh",
    sellerEmail: "ananya@campus.edu",
    available: true
  },
  {
    title: "Engineering Mathematics Vol 1",
    author: "H.K. Dass",
    subject: "Mathematics",
    condition: "Good",
    price: 0,
    listingType: "Exchange",
    sellerName: "Kiran Reddy",
    sellerEmail: "kiran@campus.edu",
    available: true
  }
];

export const sampleLibraryBooks = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Computer Science",
    totalCopies: 5,
    availableCopies: 3,
    location: "Section A, Shelf 2",
    description: "A handbook of agile software craftsmanship."
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    isbn: "978-0465050659",
    category: "Design",
    totalCopies: 4,
    availableCopies: 2,
    location: "Section B, Shelf 1",
    description: "A fascinating exploration of good & bad design."
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    category: "Psychology",
    totalCopies: 6,
    availableCopies: 4,
    location: "Section C, Shelf 3",
    description: "Two systems that shape the way we think."
  },
  {
    title: "Competitive Programming 3",
    author: "Steven Halim",
    isbn: "978-5800083169",
    category: "Computer Science",
    totalCopies: 3,
    availableCopies: 1,
    location: "Section A, Shelf 5",
    description: "Prep guide for competitive coding championships."
  },
  {
    title: "Financial Accounting",
    author: "Narayanswami",
    isbn: "978-8120348462",
    category: "Finance",
    totalCopies: 8,
    availableCopies: 5,
    location: "Section D, Shelf 2",
    description: "Core undergraduate financial accounting textbook."
  }
];

export const sampleHostelRooms = [
  {
    block: "Block A (Boys)",
    roomNumber: "A-101",
    type: "Double Sharing",
    floor: 1,
    amenities: ["AC", "WiFi", "Attached Bathroom", "Study Table"],
    monthlyRent: 8000,
    available: true,
    totalBeds: 2,
    occupiedBeds: 0
  },
  {
    block: "Block A (Boys)",
    roomNumber: "A-205",
    type: "Single Occupancy",
    floor: 2,
    amenities: ["AC", "WiFi", "Attached Bathroom", "Wardrobe", "Mini Fridge"],
    monthlyRent: 12000,
    available: true,
    totalBeds: 1,
    occupiedBeds: 0
  },
  {
    block: "Block B (Girls)",
    roomNumber: "B-103",
    type: "Triple Sharing",
    floor: 1,
    amenities: ["Fan", "WiFi", "Common Bathroom", "Study Table"],
    monthlyRent: 5500,
    available: true,
    totalBeds: 3,
    occupiedBeds: 1
  },
  {
    block: "Block B (Girls)",
    roomNumber: "B-301",
    type: "Double Sharing",
    floor: 3,
    amenities: ["AC", "WiFi", "Attached Bathroom", "Balcony"],
    monthlyRent: 9000,
    available: true,
    totalBeds: 2,
    occupiedBeds: 0
  },
  {
    block: "Block C (Mixed PG)",
    roomNumber: "C-402",
    type: "Single Occupancy",
    floor: 4,
    amenities: ["AC", "WiFi", "Attached Bathroom", "Gym Access", "Rooftop View"],
    monthlyRent: 15000,
    available: true,
    totalBeds: 1,
    occupiedBeds: 0
  }
];

export const samplePayments = (studentId, studentName) => [
  {
    studentId,
    studentName,
    invoiceId: "INV-2026-TF-001",
    type: "Tuition Fee",
    description: "Semester 1, 2026 - Academic Tuition Fee",
    amount: 75000,
    dueDate: "2026-07-15",
    status: "Pending",
    paidDate: null
  },
  {
    studentId,
    studentName,
    invoiceId: "INV-2026-HF-002",
    type: "Hostel Fee",
    description: "Semester 1 Hostel + Mess Charges (Block A)",
    amount: 35000,
    dueDate: "2026-07-20",
    status: "Pending",
    paidDate: null
  },
  {
    studentId,
    studentName,
    invoiceId: "INV-2026-EX-003",
    type: "Examination Fee",
    description: "End-Semester Examination & Practical Assessment Fee",
    amount: 2500,
    dueDate: "2026-08-01",
    status: "Pending",
    paidDate: null
  }
];

export const sampleEvents = [
  {
    title: "Virtual Tech Career Fair 2026",
    date: "2026-06-25",
    time: "1:00 PM - 5:00 PM EST",
    description: "Meet recruiters from Google, Microsoft, Stripe, and Apple. Chat about internship opportunities and drop off resumes.",
    category: "Career Fair",
    company: "Campus Tech Collective",
    attendees: []
  },
  {
    title: "Alumni Panel: Building a Career in Finance",
    date: "2026-07-02",
    time: "6:00 PM - 7:30 PM EST",
    description: "Join us for an interactive Q&A session with alumni working in Goldman Sachs, JP Morgan, and top venture capital groups.",
    category: "Panel Discussion",
    company: "University Finance Club",
    attendees: []
  }
];
