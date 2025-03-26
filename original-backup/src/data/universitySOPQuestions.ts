import { QuestionSection } from '@/types/questions';

export const universitySOPQuestions: QuestionSection[] = [
  {
    id: 'basic-requirements',
    title: 'Basic Requirements',
    description: 'University-specific requirements and program details',
    questions: [
      {
        id: 'university-instructions',
        title: 'Provide the exact instructions given by the University for the SOP',
        type: 'text',
        required: true,
      },
      {
        id: 'program-details',
        title: 'Mention the exact name of the program and specialization you are applying for.',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'specialization-details',
    title: 'Specialization Details',
    description: 'Information about your interest in this specific program',
    questions: [
      {
        id: 'specialization-motivation',
        title:
          "With this specialization being different from the one specified in your Master SOP, your answers for the below questions will help us edit the Master draft to fit the requirements of this program (Please provide detailed responses): a.What makes you want to pursue this specialization? b.How has your interest in this area evolved over the years? Mention the steps you've taken to build domain-specific skills and knowledge. What are your short-term and long-term career goals after completing this degree?",
        type: 'text',
        required: true,
      },
      {
        id: 'university-fit',
        title: 'Why do you think this University will help you achieve your dreams?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'program-specifics',
    title: 'Program Specifics',
    description: 'Details about specific aspects of the program',
    questions: [
      {
        id: 'courses-interest',
        title:
          'Are there specific courses/electives or specialized tracks that are of high interest to you?',
        type: 'text',
        required: true,
      },
      {
        id: 'professors-interest',
        title:
          'Are there professors whose research work aligns with your interests, especially those with whom you would like to work with? (mention 2 at most)',
        type: 'text',
        required: true,
      },
      {
        id: 'labs-interest',
        title:
          'Are there any labs, centers, ongoing projects that are of high interest to you? Why?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    description: 'Any other relevant details',
    questions: [
      {
        id: 'extra-info',
        title:
          'Would you like any additional information to be added to this SOP? Please provide the details here.',
        type: 'text',
        required: false,
      },
      {
        id: 'has-limit',
        title: 'Is there any word/character/page limit for the SoP?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'limit-details',
        title:
          'If the answer to the previous question is Yes, please provide the details here. (Please mention whether it is word/character/page limit and then the number)',
        type: 'text',
        required: false,
      },
    ],
  },
];
