import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize the Google Gen AI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || process.env.gemini_api_key;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get career recommendations using Gemini Structured Output
  app.post("/api/recommendations", async (req, res): Promise<any> => {
    try {
      const { name, skills, careerInterest, experienceLevel, customExpectations } = req.body;

      if (!name || !skills || !careerInterest) {
        return res.status(400).json({ error: "Missing required fields (name, skills, careerInterest)" });
      }

      const client = getAiClient();
      const prompt = `
        You are an expert career counselor and skill bridge placement specialist.
        Generate a highly personalized career assessment, score review, customized career paths, matched internships, target interview questions, and a skills analysis for:
        
        - Name: ${name}
        - Current Skills listed by user: ${skills}
        - Desired Career Interest: ${careerInterest}
        - Stated Experience Level: ${experienceLevel || "Junior / Student"}
        - Personal Career Expectations/Focus: ${customExpectations || "General tech career growth"}
        
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
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate recommended opportunities through Gemini AI Strategy." 
      });
    }
  });

  // API: Parse & Analyze resume file representing candidate profile and return structured alignment
  app.post("/api/analyze-resume", async (req, res): Promise<any> => {
    try {
      const { fileData, mimeType, fileName, careerInterest, experienceLevel, customExpectations } = req.body;

      if (!fileData || !mimeType) {
        return res.status(400).json({ error: "Missing required file data or mimeType" });
      }

      const client = getAiClient();

      const docPart = {
        inlineData: {
          mimeType: mimeType,
          data: fileData, // base64 encoded string
        },
      };

      const prompt = `
        You are a highly advanced Resume parsing algorithm and smart recruitment specialist.
        Analyze the attached resume document (PDF, Text, or generic document format) and extract/generate candidate profile data AND full career alignment metrics.
        
        Specifically:
        1. Extract the Candidate's Name (if not clearly specified or missing, generate or infer a premium candidate name like 'Alex Johnson').
        2. Extract a clean, brief comma-separated list of their core technical or professional skills found in the resume.
        3. Match these skills with their desired target Interest: "${careerInterest || 'Full Stack Engineering'}" and experience level: "${experienceLevel || 'Junior / Student'}".
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
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Error analyzing uploaded resume:", error);
      res.status(500).json({ 
        error: error.message || "Failed to analyze the uploaded resume file properly." 
      });
    }
  });

  // API: Interactive AI Career Chat with context
  app.post("/api/chat", async (req, res): Promise<any> => {
    try {
      const { messages, context } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const client = getAiClient();
      
      // We pass user's context (skills, interest, etc.) as system background instruction
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

      // Structure message exchanges
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

      res.json({ text: response.text || "" });
    } catch (error: any) {
      console.error("Chat backend error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with AI Guide." });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkillBridge AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
