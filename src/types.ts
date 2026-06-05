export interface ResumeScore {
  overall: number;
  technicalSkills: number;
  experienceLevel: number;
  projectPortfolio: number;
  communicationSkills: number;
  reasons: string[];
  suggestions: string[];
}

export interface CareerPath {
  title: string;
  icon: string; // Emoji
  description: string;
  matchPercentage: number;
  keySkillsNeeded: string[];
  learningPathSteps: string[];
}

export interface InternshipOpportunity {
  company: string;
  role: string;
  salary: string;
  matchPercentage: number;
  description: string;
  applyTips: string;
}

export interface InterviewQuestion {
  question: string;
  idealAnswerOutline: string;
  focusArea: string;
}

export interface SkillAnalysisItem {
  skillName: string;
  currentLevelPercentage: number;
  suggestedImprovement: string;
}

export interface AIRecommendationResponse {
  introduction: string;
  resumeScore: ResumeScore;
  careers: CareerPath[];
  internships: InternshipOpportunity[];
  interviewPrep: InterviewQuestion[];
  skillsAnalysis: SkillAnalysisItem[];
  quote: {
    text: string;
    author: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export interface UserContext {
  name: string;
  skills: string;
  careerInterest: string;
  experienceLevel: string;
  customExpectations: string;
}
