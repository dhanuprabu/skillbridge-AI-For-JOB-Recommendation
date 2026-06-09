import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendationResponse, UserContext } from "../types";

// Dynamic check for production hosts
export const isProductionHostStatus = () => {
  return !window.location.hostname.includes("asia-southeast1.run.app") && 
         !window.location.hostname.includes("localhost") && 
         !window.location.hostname.includes("127.0.0.1");
};

// Check if we are running in Netlify or have a client-side API key configured
export const getGeminiApiKey = () => {
  return ((import.meta as any).env?.VITE_GEMINI_API_KEY || "").trim();
};

// Lazy initialize client side GoogleGenAI
let clientGenAI: any = null;
const getClientGenAI = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not defined in your environment.");
  }
  if (!clientGenAI) {
    clientGenAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return clientGenAI;
};

// 1. RECOMMENDATIONS
export async function generateRecommendations(context: UserContext): Promise<AIRecommendationResponse> {
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(context),
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status !== 404) {
      const errDetails = await response.json().catch(() => ({}));
      throw new Error(errDetails.error || `HTTP Error ${response.status}`);
    }
  } catch (err: any) {
    // If we have a client-side Gemini key, fall back to browser execution, otherwise throw original error
    if (!getGeminiApiKey()) {
      throw err;
    }
  }

  // FALLBACK: Execute directly on the client side using browser SDK
  const client = getClientGenAI();
  const prompt = `
    You are an expert career counselor and skill bridge placement specialist.
    Generate a highly personalized career assessment, score review, customized career paths, matched internships, target interview questions, and a skills analysis for:
    
    - Name: ${context.name}
    - Current Skills listed by user: ${context.skills}
    - Desired Career Interest: ${context.careerInterest}
    - Stated Experience Level: ${context.experienceLevel || "Junior / Student"}
    - Personal Career Expectations/Focus: ${context.customExpectations || "General tech career growth"}
    
    Generate real, highly tailored recommendations suitable for their stated profiles. Provide fitting icons for key career path recommendations (use single decorative emojis). 
    Be professional, inspiring, and direct. Make sure that the overall, technical, and other scores are evaluated fairly relative to their listed skills and desired career interest.
  `;

  const response = await client.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are a professional full-stack career strategy & skills mapping system. You provide high-fidelity career bridge programs, realistic resume assessments, action plans, and smart job recommendations based specifically on the user's skills.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          introduction: { 
            type: Type.STRING, 
            description: "A summary addressing the user enthusiastically, reviewing their fit for the desired space." 
          },
          resumeScore: {
            type: Type.OBJECT,
            properties: {
              overall: { type: Type.INTEGER, description: "Scale 0-100 score of current resume & skills alignment with role interest." },
              technicalSkills: { type: Type.INTEGER, description: "Score for technical competence alignment" },
              experienceLevel: { type: Type.INTEGER, description: "Score for stated experience suitability" },
              projectPortfolio: { type: Type.INTEGER, description: "Score for how well a portfolio would rank" },
              communicationSkills: { type: Type.INTEGER, description: "Score estimation based on stated attributes" },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strengths found in their active profile." },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific changes they should make to stand out." }
            },
            required: ["overall", "technicalSkills", "experienceLevel", "projectPortfolio", "communicationSkills", "reasons", "suggestions"]
          },
          careers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                icon: { type: Type.STRING, description: "Single emoji (e.g., 🎨, 🌐, ⚙️, 🧑‍💻, 🤖) suited for this career path." },
                description: { type: Type.STRING },
                matchPercentage: { type: Type.INTEGER, description: "How close they fit today (0-100)" },
                keySkillsNeeded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Target technologies they must continue studying." },
                learningPathSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable concrete tutorial steps or study guidelines." }
              },
              required: ["title", "icon", "description", "matchPercentage", "keySkillsNeeded", "learningPathSteps"]
            }
          },
          internships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                salary: { type: Type.STRING, description: "Estimated pay rate or range, e.g., $15 - $22 / hr or Competitive" },
                matchPercentage: { type: Type.INTEGER },
                description: { type: Type.STRING, description: "Fictional or real-world inspired role descriptions ideal for skill alignment." },
                applyTips: { type: Type.STRING, description: "Specifically how to apply to stand out according to their profile." }
              },
              required: ["company", "role", "salary", "matchPercentage", "description", "applyTips"]
            }
          },
          interviewPrep: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "Highly relevant interview question for this path." },
                idealAnswerOutline: { type: Type.STRING, description: "What key bullet points to highlight to score well." },
                focusArea: { type: Type.STRING, description: "Skill dimension evaluated" }
              },
              required: ["question", "idealAnswerOutline", "focusArea"]
            }
          },
          skillsAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skillName: { type: Type.STRING },
                currentLevelPercentage: { type: Type.INTEGER, description: "0 to 100 benchmark level of user" },
                suggestedImprovement: { type: Type.STRING, description: "Concrete target or platform practice metric." }
              },
              required: ["skillName", "currentLevelPercentage", "suggestedImprovement"]
            }
          },
          quote: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              author: { type: Type.STRING }
            },
            required: ["text", "author"]
          }
        },
        required: ["introduction", "resumeScore", "careers", "internships", "interviewPrep", "skillsAnalysis", "quote"]
      }
    }
  });

  const responseText = response.text || "{}";
  return JSON.parse(responseText);
}

// 2. RESUME ANALYSIS
export async function analyzeResume(
  base64Data: string,
  mimeType: string,
  fileName: string,
  context: UserContext
): Promise<any> {
  try {
    const response = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileData: base64Data,
        mimeType: mimeType,
        fileName: fileName,
        careerInterest: context.careerInterest,
        experienceLevel: context.experienceLevel,
        customExpectations: context.customExpectations
      })
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status !== 404) {
      const errDetails = await response.json().catch(() => ({}));
      throw new Error(errDetails.error || `HTTP Error ${response.status}`);
    }
  } catch (err: any) {
    if (!getGeminiApiKey()) {
      throw err;
    }
  }

  // FALLBACK: Execute directly on the client side using browser SDK
  const client = getClientGenAI();
  const docPart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const prompt = `
    You are a highly advanced Resume parsing algorithm and smart recruitment specialist.
    Analyze the attached resume document (PDF, Text, or generic document format) and extract/generate candidate profile data AND full career alignment metrics.
    
    Specifically:
    1. Extract the Candidate's Name (if not clearly specified or missing, generate or infer a premium candidate name like 'Alex Johnson').
    2. Extract a clean, brief comma-separated list of their core technical or professional skills found in the resume.
    3. Match these skills with their desired target Interest: "${context.careerInterest || 'Full Stack Engineering'}" and experience level: "${context.experienceLevel || 'Junior / Student'}".
    4. Based on the resume analysis plus their target interest, output the FULL target career recommendations structure shown below.
    
    Ensure you align your evaluation directly to the real details stated in their resume. Be professional, direct, and constructive.
  `;

  const response = await client.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [docPart, prompt],
    config: {
      systemInstruction: "You are a professional full-stack resume parser & placement strategy mapping system. You provide high-fidelity resume extraction, career bridge pathways, and smart recommendation data.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          extractedName: { type: Type.STRING, description: "Extract candidate full name from resume." },
          extractedSkills: { type: Type.STRING, description: "Extract comma-separated clean list of technical skills from resume." },
          introduction: { 
            type: Type.STRING, 
            description: "Describe dynamic summary reviewing this uploaded resume, welcoming them and identifying core fits." 
          },
          resumeScore: {
            type: Type.OBJECT,
            properties: {
              overall: { type: Type.INTEGER },
              technicalSkills: { type: Type.INTEGER },
              experienceLevel: { type: Type.INTEGER },
              projectPortfolio: { type: Type.INTEGER },
              communicationSkills: { type: Type.INTEGER },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["overall", "technicalSkills", "experienceLevel", "projectPortfolio", "communicationSkills", "reasons", "suggestions"]
          },
          careers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                icon: { type: Type.STRING, description: "Single emoji suited for this career path." },
                description: { type: Type.STRING },
                matchPercentage: { type: Type.INTEGER },
                keySkillsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                learningPathSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "icon", "description", "matchPercentage", "keySkillsNeeded", "learningPathSteps"]
            }
          },
          internships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                salary: { type: Type.STRING },
                matchPercentage: { type: Type.INTEGER },
                description: { type: Type.STRING },
                applyTips: { type: Type.STRING }
              },
              required: ["company", "role", "salary", "matchPercentage", "description", "applyTips"]
            }
          },
          interviewPrep: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                idealAnswerOutline: { type: Type.STRING },
                focusArea: { type: Type.STRING }
              },
              required: ["question", "idealAnswerOutline", "focusArea"]
            }
          },
          skillsAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skillName: { type: Type.STRING },
                currentLevelPercentage: { type: Type.INTEGER },
                suggestedImprovement: { type: Type.STRING }
              },
              required: ["skillName", "currentLevelPercentage", "suggestedImprovement"]
            }
          },
          quote: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              author: { type: Type.STRING }
            },
            required: ["text", "author"]
          }
        },
        required: ["extractedName", "extractedSkills", "introduction", "resumeScore", "careers", "internships", "interviewPrep", "skillsAnalysis", "quote"]
      }
    }
  });

  const responseText = response.text || "{}";
  return JSON.parse(responseText);
}

// 3. CHAT
export async function sendChatMessage(messages: any[], context: UserContext): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        context
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result.text || "";
    }

    if (response.status !== 404) {
      throw new Error(`HTTP Error ${response.status}`);
    }
  } catch (err: any) {
    if (!getGeminiApiKey()) {
      throw err;
    }
  }

  // FALLBACK: Execute directly on the client side using browser SDK
  const client = getClientGenAI();
  const systemInstruction = `
    You are the SkillBridge AI Virtual Career Guide.
    Help the user dynamically build their career, find skills pathways, improve resume parameters, select suitable frameworks and languages, and offer support.
    
    Background Context about student:
    - Name: ${context?.name || "Candidate"}
    - Current Skills: ${context?.skills || "Not provided yet"}
    - Career Interest: ${context?.careerInterest || "Not specified yet"}
    - Stated Interest Level: ${context?.experienceLevel || "Not provided"}
    - expectations: ${context?.customExpectations || "General suggestions"}
    
    Rule: Be encouraging, concise, highly professional, and provide structured, human-centric advice. Avoid tech-larping or mock environment codes. Do not return markdown headings with excessive formatting, keep responses cleanly formatted and easy to read. Provide direct, highly relevant responses.
  `;

  const promptParts = messages.map((m: any) => {
    return `${m.role === "user" ? "User" : "SkillBridge Guide"}: ${m.content}`;
  }).join("\n");

  const response = await client.models.generateContent({
    model: "gemini-3.5-flash",
    contents: promptParts + "\nSkillBridge Guide:",
    config: {
      systemInstruction,
    }
  });

  return response.text || "";
}
