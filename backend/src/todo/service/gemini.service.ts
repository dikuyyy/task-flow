import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateRecommendationDto } from "../dto/generate-recommendation.dto";

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>("GEMINI_API_KEY");
        console.log("GEMINI_API_KEY loaded:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    async generateRecommendation(dto: GenerateRecommendationDto) {
        if (!this.genAI) {
            return "Gemini API Key is not configured. Please set GEMINI_API_KEY environment variables.";
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

            const prompt = `You are a helpful assistant that provides brief, actionable recommendations to solve problems with tasks. Keep response concise (2-3 sentences max).
                    
                    Task: "${dto.title}"
                    Problem: ${dto.problemDesc}
                    
                    Provide a brief recommendation to resolve this issue.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            return {
                recommendation: text || 'No recommendations available.'
            };
        } catch (error) {
            return ('Gemini API ERROR: ' + error.message);
        }
    }
}

