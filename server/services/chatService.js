import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const askSeoAssistant = async (analysis, message,previousMessages = [] ) => {
        try {

const history = previousMessages
  .map(
    (msg) => `${msg.role.toUpperCase()}: ${msg.content}`
  )
  .join("\n");

const prompt = `
You are IntelliRank AI, a professional SEO consultant.

Website Analysis

Overall Score: ${analysis.overallScore}

SEO Score: ${analysis.categories.seo}

Performance: ${analysis.categories.performance}

Accessibility: ${analysis.categories.accessibility}

Best Practices: ${analysis.categories.bestPractices}

Meta Title:
${analysis.metaData.title}

Meta Description:
${analysis.metaData.description}

SEO Issues:
${analysis.issues
  .map(
    (i) => `
Severity: ${i.severity}
Category: ${i.category}
Issue: ${i.message}
Recommendation: ${i.recommendation}
`
  )
  .join("\n")}

Previous Conversation:
${history}

Current User Question:
${message}

Instructions:

- Answer only SEO related questions.
- Use previous conversation if relevant.
- Keep answers concise.
- Use markdown.
- Use bullet points whenever possible.
- If the user asks unrelated questions, politely say you only help with SEO.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return {
            success:true,
            answer:response.text
        }

    } catch(err){

        return{
            success:false,
            error:err.message
        }

    }
}