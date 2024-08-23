
/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */


// gemini.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = "AIzaSyAUSDG79gh2Plr2DlMoSLnjE56_5s0M8Jc";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt, history = []) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      ...history,
      { role: "user", parts: [{ text: prompt }] },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  const response = result.response;
  return response.text();
}

export default run;
