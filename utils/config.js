import dotenv from "dotenv"
dotenv.config()

import { TextractClient } from "@aws-sdk/client-textract";
const awsTextractClient = new TextractClient({
    region: process.env.AWSREGION,
    credentials: { accessKeyId: process.env.AWSACCESSKEY, secretAccessKey: process.env.AWSSECRETKEY }
});

import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
const azureRecognizerClient = new DocumentAnalysisClient(process.env.AZUREENDPOINT, new AzureKeyCredential(process.env.AZURESECRETKEY));


export { awsTextractClient, azureRecognizerClient }
