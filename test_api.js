import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Read API key from .env file
const envFile = fs.readFileSync(".env", "utf-8");
const apiKey = envFile.split("=")[1].trim();

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("こんにちは");
    console.log(`Success with ${modelName}:`, result.response.text());
  } catch (error) {
    console.error(`Error with ${modelName}:`, error.message);
  }
}

async function main() {
  await testModel("gemini-2.5-flash");
  await testModel("gemini-1.5-flash");
  await testModel("gemini-2.0-flash");
}

main();
