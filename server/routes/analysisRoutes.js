import express from 'express';
import auth from '../middleware/auth.js'; // Apne folder path ke hisab se adjust kar lena
import { 
    analyzeUrl, 
    getAnalysis, 
    getAnalyses, 
    deleteAnalysis 
} from '../controllers/analysisController.js';

const analysisRouter = express.Router();

// Sabhi routes ko secure karne ke liye auth middleware ko apply karo
// Iske niche jitne bhi routes honge, un sabme req.userId automatically validation ke baad milegi

// 1. New SEO Analysis shuru karne ke liye Request (POST)
analysisRouter.post('/analyze', auth, analyzeUrl);

// 2. Dashboard ke liye saari history pagination ke sath fetch karne ke liye (GET)
analysisRouter.get('/list', auth, getAnalyses);

// 3. Kisi ek specific report ka single data dekhne ke liye Polling ya Detail page par (GET)
analysisRouter.get('/:id', auth, getAnalysis);

// 4. Kisi history card ko remove karne ke liye (DELETE)
analysisRouter.delete('/r:id', auth, deleteAnalysis);

export default analysisRouter;