import { IDocument } from '@/models/Document';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const llmService = {
  async generateDocumentContent(document: IDocument) {
    const { type, metadata } = document;
    
    // Create a prompt based on document type and metadata
    let systemPrompt = '';
    let userPrompt = '';
    
    if (type === 'lor-professor') {
      const recommender = metadata?.recommender;
      if (!recommender) throw new Error('Recommender metadata required for professor LOR');
      
      systemPrompt = `You are an expert at writing academic letters of recommendation. Write in the voice of Professor ${recommender.name}, ${recommender.title} at ${recommender.institution}. Focus on the student's academic achievements, research potential, intellectual curiosity, and classroom performance. Use the provided questions and answers to create a cohesive letter.`;
      userPrompt = `Please write a detailed academic letter of recommendation highlighting the student's scholarly abilities and potential for graduate studies. Use the following questions and answers to craft a professional letter:`;
    } else if (type === 'lor-internship') {
      const recommender = metadata?.recommender;
      if (!recommender) throw new Error('Recommender metadata required for internship LOR');
      
      systemPrompt = `You are an expert at writing internship recommendation letters. Write in the voice of ${recommender.name}, ${recommender.title} at ${recommender.institution}. Focus on the intern's practical skills, work ethic, ability to learn, and contributions to projects. Use the provided questions and answers to create a cohesive letter.`;
      userPrompt = `Please write a detailed internship recommendation letter highlighting the intern's professional growth and capabilities. Use the following questions and answers to craft a professional letter:`;
    } else if (type === 'lor-company') {
      const recommender = metadata?.recommender;
      if (!recommender) throw new Error('Recommender metadata required for company LOR');
      
      systemPrompt = `You are an expert at writing professional letters of recommendation. Write in the voice of ${recommender.name}, ${recommender.title} at ${recommender.institution}. Focus on the employee's professional accomplishments, leadership abilities, teamwork, and impact on the organization. Use the provided questions and answers to create a cohesive letter.`;
      userPrompt = `Please write a detailed professional recommendation letter highlighting the employee's work experience and capabilities. Use the following questions and answers to craft a professional letter:`;
    } else if (type?.includes('sop-')) {
      // Base SOP master template
      const baseSopSystem = `You are an expert at writing graduate school statements of purpose. Focus on academic background, research interests, career goals, and specific reasons for pursuing an advanced degree. Use the provided questions and answers to create a cohesive statement.`;
      const baseSopUser = `Please write a compelling statement of purpose for a master's program that demonstrates academic preparation and clear objectives.`;
      
      // Add university-specific context if available
      if (metadata?.university) {
        systemPrompt = `${baseSopSystem} Additionally, tailor the response specifically for ${metadata.university.name}'s ${metadata.university.program} program, emphasizing how the applicant's background aligns with the program's strengths, faculty research, and unique offerings.`;
        userPrompt = `${baseSopUser} Specifically target ${metadata.university.name}'s ${metadata.university.program} program, demonstrating deep knowledge of and fit with the program. Use the following questions and answers to craft a compelling statement:`;
      } else {
        systemPrompt = baseSopSystem;
        userPrompt = `${baseSopUser} Use the following questions and answers to craft a compelling statement:`;
      }
    } else if (type?.includes('essay') && metadata?.university) {
      systemPrompt = `You are an expert at writing university application essays specifically for ${metadata.university.name}'s ${metadata.university.program} program. Focus on personal experiences, motivations, and alignment with the university's values and culture. Use the provided questions and answers to create a cohesive essay.`;
      userPrompt = `Please write a compelling application essay for ${metadata.university.name} that showcases personality and fit with the institution. Use the following questions and answers to craft a compelling essay:`;
    }
    
    // Add questions and answers to the prompt
    userPrompt += '\n\n';
    document.answers.forEach((qa, index) => {
      userPrompt += `Question ${index + 1}: ${qa.questionId}\n`;
      userPrompt += `Answer ${index + 1}: ${qa.answer || '[No answer provided]'}\n\n`;
    });
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });
    // Process the response
    const content = response.choices[0].message.content || '';
    
    return content;
  }
};