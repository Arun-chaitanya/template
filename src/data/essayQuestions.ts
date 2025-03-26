import { QuestionSection } from '@/types/questions';

export const essayQuestions: QuestionSection[] = [
  {
    id: 'basic-requirements',
    title: 'Essay Requirements',
    description: 'University-specific essay requirements',
    questions: [
      {
        id: 'essay-instructions',
        title:
          'Provide the exact instructions given by the University for the Essay needed for application.',
        description:
          'You will find the details in the online application form; please copy and paste the Essay requirement as it is given.',
        type: 'text',
        required: true,
      },
      {
        id: 'understanding-confirmation',
        title:
          'Just as your SOP focuses on your academic and professional journey, Personal Statements should focus on your personal journey...',
        description:
          'Indicate with a YES or NO if you have broadly understood what has to be communicated through various PERSONAL ESSAYs',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
    ],
  },
  {
    id: 'personal-background',
    title: 'Personal Background',
    description: 'Your personal journey and experiences',
    questions: [
      {
        id: 'background-influence',
        title:
          'How has your personal/family background influenced your decision to pursue graduate studies?',
        description:
          'What are your personal motivations for higher studies? Has the family or certain events or individuals played a role in this?',
        type: 'text',
        required: true,
      },
      {
        id: 'education-challenges',
        title:
          'Did you face obstacles/difficulties/challenges to access education or while you were studying?',
        description:
          'Give specific details of financial, cultural, familial, location or other barriers.',
        type: 'text',
        required: true,
      },
      {
        id: 'overcoming-challenges',
        title: 'How did you overcome those?',
        type: 'text',
        required: true,
      },
      {
        id: 'personal-growth',
        title: 'How did it influence you as a person?',
        description:
          'Did you develop certain soft-skills? Did your personal philosophy/outlook evolve positively? How?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'social-impact',
    title: 'Social Impact & Diversity',
    description: 'Your contribution to society and experience with diversity',
    questions: [
      {
        id: 'international-importance',
        title:
          'Why is graduate studies in an International University important to you as a person or from a perspective of personal achievement?',
        description: 'Discuss this from what it means to you or your family?',
        type: 'text',
        required: true,
      },
      {
        id: 'helping-others',
        title:
          'Do you have experiences in working for or helping students from socially or economically deprived backgrounds with their education?',
        description:
          'Provide details about helping others gain access to resources necessary for success.',
        type: 'text',
        required: true,
      },
      {
        id: 'social-responsibility',
        title:
          'Give details about your work till date that showed your Social Responsibility or Sustainable Development.',
        description:
          "We should talk about efforts for 'sustainable welfare' [like activities done through NSS, Company CSR etc] and not individual acts like blood donation or personal charity.",
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'diversity-experience',
    title: 'Diversity & Campus Life',
    description: 'Your experience with diversity and potential contribution to campus life',
    questions: [
      {
        id: 'diverse-experience',
        title:
          'Have you ever worked or studied with colleagues from diverse backgrounds? If so, then what did you learn from the experience?',
        description:
          'Mention one context where you had a rich and positive experience of this kind.',
        type: 'text',
        required: true,
      },
      {
        id: 'unique-contribution',
        title:
          'What UNIQUE skills, abilities, talents do you possess by which you can add to the richness of the Campus life?',
        description:
          'Think of your hobbies, interests, skills that can enrich campus life. Also your ability to lead/organize/coordinate events or drive societies.',
        type: 'text',
        required: true,
      },
      {
        id: 'personal-evolution',
        title: 'Do you believe graduate studies will evolve you as a person? How?',
        type: 'text',
        required: true,
      },
    ],
  },
];
