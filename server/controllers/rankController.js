import KeywordTracking from '../models/KeywordTracking.js';
import { keywordTracking } from '../services/keywordTrackingService.js';
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
    const existing = await KeywordTracking.findOne({ userId: req.userId, keyword:keyword.toLowerCase().trim(), domain });
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
    keywordTracking(tracking)
}
catch (error) {
    console.error('Error adding keyword:', error.message);
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Already tracking this keyword for this domain' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
}}

//Get all tracked keywords for user
export const getAllKeywords=async(req,res)=>{
    try {
        const keywords = await KeywordTracking.find({ userId: req.userId }).sort({createdAt: -1}).
        select("-rankHistory");
        res.json({ success: true, keywords });
    } catch (error) {
        console.error('Get keywords error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

//Get single tracked keyword for user with full history
export const getKeyword=async(req,res)=>{
        try {
        const tracking = await KeywordTracking.findOne({ _id: req.params.id, userId: req.userId });
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        res.json({ success: true, tracking });
    } catch (error) {
        console.error('Get keyword error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }

}

//Manually refresh a keyword ranking
export const refreshKeyword=async(req,res)=>{
    try {
        const tracking = await KeywordTracking.findOne({ _id: req.params.id, userId: req.userId });
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        tracking.status='checking';
        await tracking.save();
        res.json({ success: true, message: 'Rank check started' });
        keywordTracking(tracking)
    } catch (error) {
        console.error('Refresh keyword error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

//Delete keyword tracking
export const deleteKeyword=async(req,res)=>{
        try {
        const tracking = await KeywordTracking.findByIdAndDelete({ _id: req.params.id, userId: req.userId });
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        res.json({ success: true, message: 'Keyword tracking deleted' });
    } catch (error) {
        console.error('Delete keyword error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }

}

//Toggle  tracking active/inactive
export const toggleTracking=async(req,res)=>{
            try {
        const tracking = await KeywordTracking.findOne({ _id: req.params.id, userId: req.userId });
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        tracking.active=!tracking.active;
        await tracking.save();
        res.json({ success: true, message: 'Keyword tracking updated' });
    } catch (error) {
        console.error('Toggle tracking error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }

}