import express from 'express';
import { addKeyword, getAllKeywords, getKeyword, refreshKeyword,toggleTracking,deleteKeyword } from '../controllers/rankController.js';
import auth from '../middleware/auth.js';

const rankRouter = express.Router();

rankRouter.post('/add', auth,addKeyword);
rankRouter.get('/list', auth,getAllKeywords);
rankRouter.get('/:id', auth,getKeyword);
rankRouter.post('/:id/refresh', auth,refreshKeyword);
rankRouter.put('/:id/toggle', auth,toggleTracking);
rankRouter.delete('/:id', auth,deleteKeyword);

export default rankRouter;