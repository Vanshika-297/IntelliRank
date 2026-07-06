import express from "express";
import auth from "../middleware/auth.js";
import { chatWithSeoAssistant,getChatHistory } from "../controllers/chatController.js";

const chatRouter=express.Router();

chatRouter.post("/",auth,chatWithSeoAssistant);
chatRouter.get("/:analysisId", auth, getChatHistory);

export default chatRouter;