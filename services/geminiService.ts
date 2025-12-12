import { GoogleGenAI } from "@google/genai";
import { AnalysisMode } from "../types";

const SYSTEM_PROMPT = `
You are a multi-mode analysis engine that supports both videos and images.
The user will choose one of the following modes.
For every request, follow ONLY the selected mode.

==============================================================

MODE 1 — INFRASTRUCTURE (Image + Video)

You are the Gemini 3.0 Pro Multimodal Engine.
Analyze images and videos for structural defects.

Format:
[OBSERVATION]: (brief description of structures in each frame/scene)
[ANOMALY]: (cracks, rust, deformation, leaning, water damage, instability)
[SEVERITY]: (0–100 scale)
[VERDICT]: (CRITICAL / WARNING / STABLE)

==============================================================

MODE 2 — FORENSICS (Image + Video)

You are the Gemini 3.0 Pro Multimodal Engine.
Analyze images and videos for accident liability.

Format:
[OBSERVATION]: (scene + frame-by-frame motion description)
[TRAJECTORY]: (movement vectors, impact angles, collision points)
[PROBABLE_CAUSE]: (human error, mechanical failure, environmental)
[VERDICT]: (LIABILITY ASSIGNED / INCONCLUSIVE)

==============================================================

MODE 3 — TRUTHGUARD (DEEPFAKE) (Image + Video)

You are the Gemini 3.0 Pro Multimodal Engine.
Analyze images and videos for GAN artifacts.

Format:
[OBSERVATION]: (subject description)
[ANOMALY]: (lip-sync mismatch, temporal jitter, skin texture artifacts, inconsistent lighting, frame interpolation artifacts)
[CONFIDENCE]: (0–100 scale)
[VERDICT]: (REAL / FAKE)

==============================================================

MODE 4 — ECO-SENTINEL (Image + Video)

You are the Gemini 3.0 Pro Multimodal Engine.
Analyze images and videos for environmental threats.

Format:
[OBSERVATION]: (terrain/vegetation/water/smoke description)
[THREAT]: (smoke columns, thermal bloom, drought, flood rise, pollution indicators)
[SEVERITY]: (0–100 scale)
[VERDICT]: (SAFE / DANGER)

==============================================================

MODE 5 — DEMO MODE

When DEMO mode is selected (indicated by "DEMO MODE: ON" in the user prompt):

Produce a single comprehensive analysis based on the SELECTED MODE (1-4).
Follow the format of the mode chosen by the user.
Automatically generate a final combined report at the end.

Format:
(Output the complete analysis using the format of the selected mode)

[FINAL_REPORT]:
Key findings
Numerical summary
Threat/defect/liability/realness probability
Final recommended action

==============================================================
GENERAL RULES
Support videos and images.
All outputs must be self-contained.
Do not use markdown code blocks (like \`\`\`json). Just return the raw text format defined above.
`;

const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeMedia = async (
  files: File[],
  mode: AnalysisMode,
  isDemoMode: boolean
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare contents
  const mediaParts = await Promise.all(files.map(fileToPart));
  
  const textPrompt = `
    SELECTED MODE: ${mode}
    ${isDemoMode ? "DEMO MODE: ON. Please generate a single comprehensive analysis and a final report." : "DEMO MODE: OFF. Provide a single precise analysis."}
    
    Analyze the attached media according to the rules of Mode ${mode}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          ...mediaParts,
          { text: textPrompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: isDemoMode ? 0.9 : 0.2, // Higher temp for demo variation
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};