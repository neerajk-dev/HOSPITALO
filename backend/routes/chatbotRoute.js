import express from "express";
import { chatbot } from "../controllers/aiControler.js";


const aiRouter = express.Router();

// ✅ POST /api/chat — Handles chatbot message requests
aiRouter.post("/chat", chatbot);

export default aiRouter;
