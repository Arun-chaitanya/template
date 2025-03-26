import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type LLMMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const llmService = {
  /**
   * Generate a text completion using the OpenAI API
   * @param messages Array of message objects with role and content
   * @param model The model to use (defaults to gpt-4-turbo)
   * @param temperature Controls randomness (0-1, defaults to 0.7)
   * @returns Generated content as string
   */
  async generateCompletion(
    messages: LLMMessage[],
    model: string = "gpt-4-turbo",
    temperature: number = 0.7
  ) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }
    
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });
    
    return response.choices[0].message.content || '';
  },

  /**
   * Simplified helper for text generation with just system and user prompts
   * @param systemPrompt Instructions for the AI
   * @param userPrompt User's input
   * @param model The model to use (defaults to gpt-4-turbo)
   * @returns Generated content as string
   */
  async generateText(
    systemPrompt: string,
    userPrompt: string,
    model: string = "gpt-4-turbo"
  ) {
    return this.generateCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], model);
  },
  
  /**
   * Generate an image using DALL-E
   * @param prompt The image description
   * @param size Image size (defaults to 1024x1024)
   * @param quality Image quality (defaults to standard)
   * @returns URL to the generated image
   */
  async generateImage(
    prompt: string,
    size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024',
    quality: 'standard' | 'hd' = 'standard'
  ) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality,
    });

    return response.data[0].url;
  }
};