import KeywordTracking from '../models/KeywordTracking.js';
//Add keyword to track
export const addKeyword=async(req,res)=>{
try {
    const { keyword, url } = req.body;

    if (!keyword || !url) {
        return res.status(400).json({ success: false, message: 'Keyword and URL are required' });
    }
    //Extract domain from URL
    let domain;
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
        domain = urlObj.hostname.replace("www.","");
    } catch  {
        return res.status(400).json({ success: false, message: 'Invalid URL format' });
    }
    //Check if alredy tracking this keyword
    const existing = await KeywordTracking.findOne({ userId: req.user.id, keyword:keyword.toLowerCase().trim(), domain });
    if (existing) {
        return res.status(400).json({ success: false, message: 'Already tracking this keyword for this domain' });
    }
    //Create tracking entry
    const  tracking=await KeywordTracking.create({
        userId: req.userId,
        keyword: keyword.toLowerCase().trim(),
        url:url.startsWith('http') ? url : `http://${url}`,
        domain,
        status: 'checking',
    });
    res.status(201).json({ success: true, message: 'Keyword tracking started', tracking });
    
}
catch (error) {
    console.error('Error adding keyword:', error);
    res.status(500).json({ success: false, message: 'Server error' });
}}

//Get all tracked keywords for user
export const getAllKeywords=async(req,res)=>{}

//Get single tracked keyword for user with full history
export const getKeyword=async(req,res)=>{}

//Manually refresh a keyword ranking
export const refreshKeyword=async(req,res)=>{}

//Delete keyword tracking
export const deleteKeyword=async(req,res)=>{}

//Toggle  tracking active/inactive
export const toggleTracking=async(req,res)=>{}