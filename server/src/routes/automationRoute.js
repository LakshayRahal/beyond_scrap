import express from "express";
import { runScraper } from "../controllers/automationController.js";
import { runAIUpdate} from "../controllers/automationController.js";
const router = express.Router();

router.post("/scrape-beyondchats", runScraper);

router.post("/run-ai-update", runAIUpdate);

export default router;

