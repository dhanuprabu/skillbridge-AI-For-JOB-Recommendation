import { AIRecommendationResponse } from "./types";

export const initialRecommendationData: AIRecommendationResponse = {
  introduction: "Welcome to SkillBridge AI! Your profile details a balanced initial skill set spanning modern frontend applications and basic software concepts. Review your targeted feedback segments below to accelerate your growth.",
  resumeScore: {
    overall: 78,
    technicalSkills: 80,
    experienceLevel: 65,
    projectPortfolio: 85,
    communicationSkills: 80,
    reasons: [
      "Excellent client-side structure familiarity.",
      "Clear interest indicators towards user experience architecture.",
      "A proactive portfolio showcasing live deployments."
    ],
    suggestions: [
      "Incorporate unit testing frameworks to demonstrate enterprise readiness.",
      "Add state management patterns (like Redux or Zustand) to show scalability understanding.",
      "Implement persistent cloud structures or basic Serverless integrations to bridge backend."
    ]
  },
  careers: [
    {
      title: "Frontend Experience Architect",
      icon: "🎨",
      description: "Spearheat highly responsive user interfaces, designing layout hierarchies, aesthetic consistency, and performant state pipelines.",
      matchPercentage: 92,
      keySkillsNeeded: ["React 19 Hooks", "Tailwind styling optimization", "TypeScript typed props", "Storybook validation"],
      learningPathSteps: [
        "Construct 3 full responsive web client architectures.",
        "Deepen your understanding of bundle optimization, web vitals, and asset performance loading.",
        "Perform accessibility reviews implementing high contrast, custom ARIA attributes, and keyboard controls."
      ]
    },
    {
      title: "Full Stack Systems Developer",
      icon: "🌐",
      description: "Bridge the absolute bridge of frontend interface design with resilient, container-orchestrated REST/gRPC backend routes.",
      matchPercentage: 84,
      keySkillsNeeded: ["Express middleware", "Node.js cluster orchestration", "PostgreSQL database engines", "Docker containerization"],
      learningPathSteps: [
        "Implement server-authoritative databases with complete data lifecycle protection.",
        "Manage secure user identity sessions utilizing JWT/OAuth with high-security configurations.",
        "Design caching endpoints with Redis to bypass database query overhead."
      ]
    },
    {
      title: "Cloud Native Solution Builder",
      icon: "⚡",
      description: "Oversee distributed architectures, scalable continuous integrations, metric analytics pipelines, and secure cloud system logic.",
      matchPercentage: 74,
      keySkillsNeeded: ["GitHub actions CI/CD", "AWS Lambda routing", "Terraform IAC structures", "Nginx routing tables"],
      learningPathSteps: [
        "Integrate automated linting, testing, and compilation stages into standard version controls.",
        "Deploy modular apps on managed Cloud Containers with secure HTTPS traffic pipelines.",
        "Establish monitoring and telemetry structures to track application crashes and status variables."
      ]
    }
  ],
  internships: [
    {
      company: "InnovateTech Global",
      role: "User Interface Strategy Intern",
      salary: "$24 - $32 / hr",
      matchPercentage: 94,
      description: "Work within a collaborative product squad designing reusable, lightweight dashboard modules for large-scale telemetry datasets.",
      applyTips: "Highlight responsive grids, performant canvas elements, and present a structured code sample focusing on strict types."
    },
    {
      company: "CoreWeb Systems Group",
      role: "Associate Frontend Developer Intern",
      salary: "$20 - $28 / hr",
      matchPercentage: 88,
      description: "Contribute to a major client application redesign, ensuring standard CSS/Tailwind utility efficiency and modular page states.",
      applyTips: "Detail your experience with custom React hooks and how you manage modular application memory to prevent deep render loops."
    }
  ],
  interviewPrep: [
    {
      question: "Can you explain how React schedules updates and when you should opt for virtualized list structures?",
      idealAnswerOutline: "Talk about component reconciliation, the Fiber engine, the side effects of deep parent renders, and how virtualized systems maintain performance by restricting DOM nodes.",
      focusArea: "Frontend Performance Optimization"
    },
    {
      question: "How do you secure server endpoints and protect database integrations against query modifications or script injections?",
      idealAnswerOutline: "Mention using parameterized queries, validating request inputs early with strict schemas, filtering headers with Helmet, and encrypting access tokens securely.",
      focusArea: "Backend Security"
    }
  ],
  skillsAnalysis: [
    {
      skillName: "JavaScript / ES14 Core",
      currentLevelPercentage: 85,
      suggestedImprovement: "Study engine execution mechanics, event loop structures, microtasks, and garbage collection behaviors."
    },
    {
      skillName: "React & Client Hook States",
      currentLevelPercentage: 80,
      suggestedImprovement: "Deepen understanding of React 19 transitions, useRef storage synchronization, and memoized callbacks."
    },
    {
      skillName: "TypeScript Safety Mapping",
      currentLevelPercentage: 75,
      suggestedImprovement: "Exercise advanced generics, template literal types, discriminated unions, and utility types."
    }
  ],
  quote: {
    text: "True craft doesn't mean building unrequested functional noise; it's about executing target systems with absolute layout harmony, precise color balance, and clear purpose.",
    author: "Modern Design Axiom"
  }
};
