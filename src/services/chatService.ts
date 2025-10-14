import { GoogleGenerativeAI } from "@google/generative-ai";
import { DPRAnalysis } from "../types";

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  }

  async sendMessage(
    message: string,
    history: ChatMessage[],
    analysisData?: DPRAnalysis | null,
    fileName?: string | null
  ): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      // Build context from analysis data
      let contextPrompt = "";
      if (analysisData && fileName) {
        contextPrompt = `
You are a helpful assistant for the DPR (Detailed Project Report) Evaluation Platform. 
You have access to the analysis results of the document "${fileName}".

Here's the analysis data you can reference:
- Overall Compliance: ${analysisData.overall_compliance}
- Compliance Score: ${analysisData.compliance_score}/100

Summary:
${analysisData.summary}

Strengths Found:
${
  analysisData.strengths
    ?.map((strength: string, i: number) => `${i + 1}. ${strength}`)
    .join("\n") || "No strengths documented"
}

Red Flags Identified:
${
  analysisData.red_flags
    ?.map(
      (flag: any, i: number) =>
        `${i + 1}. ${flag.issue} (${flag.severity}) - ${flag.details}`
    )
    .join("\n") || "No red flags found"
}

Missing Components:
${
  analysisData.missing_components
    ?.map((component: string, i: number) => `${i + 1}. ${component}`)
    .join("\n") || "No missing components"
}

Please answer questions about this DPR analysis in a helpful and informative way. 
If the user asks about specific aspects of the analysis, refer to the data above.
If you don't have specific information about something they're asking, let them know that politely.
Keep your responses concise but informative.
`;
      } else {
        contextPrompt = `
You are a helpful assistant for the DPR (Detailed Project Report) Evaluation Platform.
Currently, no DPR document has been analyzed. Please let the user know they need to upload and analyze a DPR document first to get specific insights.
You can help with general questions about DPR evaluation, project planning, or how to use this platform.
`;
      }

      // Filter history to only include user-bot exchanges, excluding initial bot messages
      // and ensure it starts with a user message
      const filteredHistory = history.filter(
        (msg) =>
          msg.role === "user" ||
          (msg.role === "model" && history.indexOf(msg) > 0)
      );

      // If the filtered history is empty or starts with model, create a proper structure
      let chatHistory: ChatMessage[] = [];
      if (filteredHistory.length > 0 && filteredHistory[0].role === "user") {
        chatHistory = filteredHistory;
      }

      // Use the same structure as your working gemini.ts
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const chat = model.startChat({
        history: chatHistory,
      });

      const fullMessage = contextPrompt + "\n\nUser question: " + message;
      const result = await chat.sendMessageStream(fullMessage);

      return this.streamResponse(result);
    } catch (error) {
      console.error("Error in chat service:", error);
      throw error;
    }
  }

  private async *streamResponse(
    result: any
  ): AsyncGenerator<string, void, unknown> {
    try {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      throw error;
    }
  }
}
