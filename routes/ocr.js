import express from "express";
import { performAwsOcr, performAzureOcr } from "../controllers/ocr.js";
const router = express.Router();

router.get("/awsTextract", performAwsOcr)
router.get("/azureFormRecognizer", performAzureOcr)

export default router