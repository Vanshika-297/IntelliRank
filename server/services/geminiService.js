import {GoogleGenAI, Type} from '@google/genai';

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})

// Response schema for structured SEO analysis
const seoAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER },
        categories: {
            type: Type.OBJECT,
            properties: {
                seo: { type: Type.INTEGER },
                performance: { type: Type.INTEGER },
                accessibility: { type: Type.INTEGER },
                bestPractices: { type: Type.INTEGER },
            },
            required: ["seo", "performance", "accessibility", "bestPractices"],
        },
        keywords: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    count: { type: Type.INTEGER },
                    density: { type: Type.NUMBER },
                },
                required: ["word", "count", "density"],
            },
        },
        issues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    severity: {
                        type: Type.STRING,
                        format: "enum",
                        enum: ["critical", "warning", "info"],
                    },

                    category: { type: Type.STRING },
                    message: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                },
                required: ["severity", "category", "message", "recommendation"],
            },
        },
    },
    required: ["overallScore", "categories", "keywords", "issues"],
};

export async function analyzeSeoData(scrapedData){
    try {
        // Safe access for metaData to prevent crashing on undefined
        const title = scrapedData?.metaData?.title || "";
        const desc = scrapedData?.metaData?.description || "";
        
        // Prompt for getting SEO Analysis structured data from AI
        const prompt = `You are an expert SEO analyst. Analyze the following website data and provide a comprehensive SEO audit.

Website URL: ${scrapedData?.url || "N/A"}
Load Time: ${scrapedData?.loadTime || 0}ms
Status Code: ${scrapedData?.statusCode || "N/A"}
Page Size: ${Math.round((scrapedData?.pageSize || 0) / 1024)}KB
Word Count: ${scrapedData?.wordCount || 0}

META DATA:
- Title: "${title}" (${title.length} chars)
- Description: "${desc}" (${desc.length} chars)
- Canonical: "${scrapedData?.metaData?.canonical || ""}"
- Robots: "${scrapedData?.metaData?.robots || ""}"
- OG Title: "${scrapedData?.metaData?.ogTitle || ""}"
- OG Description: "${scrapedData?.metaData?.ogDescription || ""}"
- OG Image: "${scrapedData?.metaData?.ogImage || ""}"
- Twitter Card: "${scrapedData?.metaData?.twitterCard || ""}"
- Viewport: "${scrapedData?.metaData?.viewport || ""}"
- Charset: "${scrapedData?.metaData?.charset || ""}"

HEADINGS:
- H1: ${scrapedData?.headings?.h1 || 0} (texts: ${JSON.stringify(scrapedData?.headings?.h1Texts || [])})
- H2: ${scrapedData?.headings?.h2 || 0}
- H3: ${scrapedData?.headings?.h3 || 0}
- H4: ${scrapedData?.headings?.h4 || 0}
- H5: ${scrapedData?.headings?.h5 || 0}
- H6: ${scrapedData?.headings?.h6 || 0}

LINKS:
- Internal: ${scrapedData?.links?.internal || 0}
- External: ${scrapedData?.links?.external || 0}
- Total: ${scrapedData?.links?.total || 0}

IMAGES:
- Total: ${scrapedData?.images?.total || 0}
- Missing Alt Text: ${scrapedData?.images?.missingAlt || 0}
- With Alt Text: ${scrapedData?.images?.withAlt || 0}

PAGE CONTENT (first 3000 chars):
${(scrapedData?.bodyText || "").slice(0,3000)}

Scoring guidelines:
- Title: 50-60 chars optimal, must exist
- Description: 150-160 chars optimal, must exist
- H1: exactly 1 is ideal
- Images: all should have alt text
- Load time: <3s good, <5s ok, >5s poor
- Page size: <3MB good
- Must have viewport meta, charset, canonical
- OG tags and Twitter cards are important
- Internal linking is good for SEO
- Word count: >300 words for content pages
- Check heading hierarchy

Severity levels must be exactly one of: "critical", "warning", or "info".
Provide 5-15 issues sorted by severity (critical first). Be specific and actionable with recommendations.
Extract top 10 keywords by frequency from the page content.`;

        const response=await ai.models.generateContent({
            model:'gemini-2.5-flash',
            contents:[{role:"user",parts:[{text:prompt}]}],
            config:{
                responseMimeType:"application/json",
                responseSchema:seoAnalysisSchema,
            }
        });

        const analysis=JSON.parse(response.text)
        return {success: true, data:analysis}

    } catch (error) {
        console.error("================ AI ERROR DETAILED LOG ================");
        console.error("Model Name: gemini-2.5-flash");
        console.error("HTTP Status:", error.status || "N/A");
        console.error("Error Code:", error.code || "N/A");
        console.error("Error Message:", error.message);
        console.error("Response Status:", error.response?.status || "N/A");
        console.error("Scraped Data Exists:", !!scrapedData);
        console.error("Scraped Data URL:", scrapedData ? scrapedData.url : "N/A");
        console.error("Length of Scraped Data Body:", scrapedData && scrapedData.bodyText ? scrapedData.bodyText.length : "N/A");
        console.error("=======================================================");
        
        return {success:false, error:error.message}
    }
}