import Analysis from '../models/analysisModel.js';
import { scrapeUrl } from '../services/scraperService.js';

//Analyse a URL
export const analyzeUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({success: false, message: 'URL is required' });
        }
            //Valid URL format
            let validUrl;
            try {
                validUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
            } catch (error) {
                return res.status(400).json({success: false, message: 'Invalid URL format' });
            }

            //Create analysis record with pending status
             const analysis = await Analysis.create({userId: req.userId, url: validUrl.href, status: 'processing'});
             
             //Send immediate response with analysis ID
                res.json({success: true, message: 'Analysis started', analysisId: analysis._id});

            //Run Scrapping and analysis in the background
            try {
                //Step 1: Scrape the URL with BrowserBase
                const scrapeResult=await scrapeUrl(validUrl.href)

                if(!scrapeResult.success){
                    analysis.status="failed";
                    await analysis.save();
                    return;
                }

                //Step 2:Anayze with Gemini API
                const aiResult = await analyzeSeoData(scrapeResult); 

                if (!aiResult.success) {
                    analysis.status = "failed";
                    await analysis.save();
                    return;
                }

                //Step 3:Save Results
                analysis.overallScore = aiResult.data.overallScore || 0;
                analysis.categories = aiResult.data.categories || {};
                analysis.keywords = aiResult.data.keywords || [];
                analysis.issues = aiResult.data.issues || [];

                // Direct scraper mappings (Jo mongoose schema demand karta hai)
                analysis.metaData = scrapeResult.data.metaData || {};
                analysis.headings = scrapeResult.data.headings || {};
                analysis.links = scrapeResult.data.links || {} ;
                analysis.images = scrapeResult.data.images || {};
                analysis.wordCount = scrapeResult.data.wordCount || 0;
                
                // Extra metrics aur execution status
                analysis.loadTime = scrapeResult.data.loadTime || 0;
                analysis.pageSize = scrapeResult.data.pageSize || 0;
                analysis.status = "completed";

                // Finally database mein update commit karo
                await analysis.save();
                
        }catch(bgError){
            console.error("[BACKGROUND ERROR]:", bgError);
             try{   analysis.status = "failed";
                await analysis.save();
             }catch(saveError){

             }

        }
    }catch(error){
        console.error("Analyze URL error:",error.message);
        if(!res.headersSent){
            res.status(500).json({succes:false,message:"Server error"})
        }
    }

}

//Get analysis by ID
export const getAnalysis= async (req, res) => {}

//Get all analysis for a user
export const getAllAnalysis = async (req, res) => {}

//Delete analysis 
export const deleteAnalysis = async (req, res) => {}
