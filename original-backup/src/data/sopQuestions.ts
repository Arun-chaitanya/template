import { Question } from '@/types/questions';

export const masterSOPQuestions: Question[] = [
  {
    id: 'specialization_field',
    title: 'What field would you like to specialize in for your MS degree?',
    description:
      'Can you share with me how your interest in this field started? Please describe any events, experiences, inspiring personalities, or opportunities from your academic and professional life that initially sparked your interest. Additionally, please discuss any experiences or opportunities that have further strengthened your interest in this field. Lastly, please share any special skills or talents that you have developed as a result of your interest in this field.',
    category: 'specialization',
    required: true,
    maxLength: 1000,
    type: 'text'
  },
  {
    id: 'specialization_passion',
    title: 'What is it that makes you passionate about your particular area of specialization?',
    description:
      'Please describe what drives your intense enthusiasm and compelling desire to pursue your field of specialization. We are interested in hearing about the steps you have taken to nurture your passion and develop relevant knowledge and professional skills in this area. While it is important to share how you initially acquired a passion for this field, we would like you to focus more on the actions you have taken to demonstrate your passion and commitment. In other words, what have you done to cultivate your interest in this area and prepare for graduate studies? Please provide specific examples to illustrate your answer. Remember, passion alone is not enough – tell us how you have translated your passion into action and reached a point where you are now ready for the next step in your academic journey.',
    category: 'specialization',
    required: true,
    maxLength: 1200,
    type: 'text'
  },
  {
    id: 'degree_motivation',
    title: 'What motivated you to pursue this degree?',
    description:
      'Please describe the factors that influenced your decision to pursue higher education in your area of interest. Specifically, we would like to understand why you have chosen to pursue this degree at this point in your life. What do you hope to gain from this degree, and how do you see it making a difference in your career? Please provide details about your career goals and how this degree aligns with them.',
    category: 'career_goals',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'undergrad_major',
    title: 'What was your major during your undergraduate studies?',
    description:
      'Please share the name of the degree you pursued during your undergraduate studies.',
    category: 'academic_background',
    required: true,
    maxLength: 100,
    type: 'text'
  },
  {
    id: 'major_motivation',
    title: 'What motivated you to choose your undergraduate major?',
    description:
      'Please describe the factors that influenced your decision to pursue your chosen major during your undergraduate studies. What motivated you to select this particular field of study? Given that there were other options available to you, why did you choose this major? Please provide details about what drew you to this field, any relevant experiences or skills that influenced your decision, and how your major aligned with your personal or career goals at the time.',
    category: 'academic_background',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'academic_achievements',
    title: 'Did you achieve high marks or ranks in your undergraduate program?',
    description:
      'Please share any notable achievements related to your academic performance during your undergraduate studies. Were you the top scorer in any of your classes? If so, which ones? Please provide details about any academic honors, awards, or recognitions you received for your performance in your undergraduate program.',
    category: 'academic_background',
    required: true,
    maxLength: 600,
    type: 'text'
  },
  {
    id: 'relevant_coursework',
    title:
      'Which undergraduate courses and labs provided you with useful knowledge and skills for your MS studies?',
    description:
      'Please share how your undergraduate coursework has impacted your growth and shaped your interests. Specifically, we would like to know which courses and labs you found most enjoyable and why. Additionally, please describe the knowledge and skills you gained from these courses and labs that you believe will be useful during your MS studies. Please provide a brief summary of the courses you completed during your undergraduate studies and how your interests evolved over the four-year period.',
    category: 'academic_background',
    required: true,
    maxLength: 1000,
    type: 'text'
  },
  {
    id: 'undergrad_projects',
    title:
      "Describe the projects you completed during your undergrad. Classify them under 'relevant' and 'not-so-relevant but significant'.",
    description:
      "In your answer to this question, we would like to know about the projects you completed during your undergraduate studies. Classify each project as either 'relevant' or 'not-so-relevant but significant' to your field of specialization. Discuss the motivation behind each project, its objective, the tools, technologies, or methodologies used, and the skills you acquired while working on it. Be sure to specify the dates and duration of each project.",
    category: 'academic_background',
    required: true,
    maxLength: 1200,
    type: 'text'
  },
  {
    id: 'thesis_project',
    title:
      'Describe your undergraduate thesis project, including its purpose, objectives, execution, and skills acquired.',
    description:
      "In your answer, discuss the motivation behind your thesis project and the skills you gained from it. Explain the purpose and objectives of the project, as well as the methods and techniques you used to execute it. Don't forget to highlight the specific skills you acquired as a result of working on this project.",
    category: 'academic_background',
    required: true,
    maxLength: 1000,
    type: 'text'
  },
  {
    id: 'internships',
    title:
      'What were your internships, industrial visits, and training experiences during your undergraduate studies?',
    description:
      'From your response to this question, we would like to know the details of your internships and training experiences, including the tools, technologies, and methodologies you used, as well as the skills you acquired during these programs. Additionally, please provide the dates and duration of each experience. In your response, we are interested in learning more about your motivations for pursuing these experiences and the specific knowledge and skills that you gained as a result.',
    category: 'professional_experience',
    required: true,
    maxLength: 1000,
    type: 'text'
  },
  {
    id: 'publications',
    title: 'Can you list any papers you authored and published during your undergraduate studies?',
    description:
      'In this question, we would like you to provide a list of any papers that you have authored and published during your undergraduate studies. Additionally, we would like you to discuss the experiences you gained through these publications, including the motivations behind the papers and the knowledge you acquired.',
    category: 'academic_background',
    required: false,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'mentoring_experience',
    title: 'What are your experiences in training or mentoring others during your college program?',
    description:
      'Share your experiences in teaching or mentoring your peers or juniors, whether it was done formally or informally. Reflect on how these experiences have impacted your personal and professional growth.',
    category: 'personal_development',
    required: false,
    maxLength: 600,
    type: 'text'
  },
  {
    id: 'work_experience',
    title: 'What is your work experience, and how has it impacted your growth and development?',
    description:
      'In this question, we would like you to describe your work experiences, including the organizations you have worked with, dates and duration of work, and your motivation behind joining each company. Share your project experiences and elaborate on the challenges you faced and the skills you learned. Additionally, focus on how your experiences have shaped your perspectives and helped you grow as a professional.',
    category: 'professional_experience',
    required: true,
    maxLength: 1200,
    type: 'text'
  },
  {
    id: 'career_change',
    title: 'Did you pursue a career in a sector different from your undergraduate major?',
    description:
      'If yes, discuss the motivations behind this decision and how it has influenced your career growth. Elaborate on the skills and knowledge you acquired that have been relevant in this new field, and how you managed to bridge any gaps between your undergraduate education and your current job role.',
    category: 'professional_experience',
    required: false,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'higher_education_motivation',
    title: 'How have your career experiences influenced your decision to pursue higher education?',
    description:
      'In your response to this question, please discuss how your professional experiences have influenced your motivation to pursue a higher education degree. Elaborate on the specific exposures you have received in your field of interest that have inspired you to continue your academic journey.',
    category: 'career_goals',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'industry_opportunities',
    title:
      'What are the opportunities in the industry for a person with your profile and areas of interest?',
    description:
      'In your response to this question, we would like you to discuss the potential job prospects and growth opportunities available to you in the industry, considering your profile and areas of interest. You can elaborate on the skills and knowledge that you have acquired and how they align with industry requirements, highlighting any particular sector or domain that you are interested in pursuing.',
    category: 'career_goals',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'short_term_goals',
    title: 'What are your short-term career goals?',
    description:
      'As a part of your application, you are required to outline your career goals for the first five years after completing the program. In this question, you should discuss the career milestones you aim to achieve within this timeframe, including the specific steps you plan to take to achieve these goals.',
    category: 'career_goals',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'long_term_goals',
    title: 'What are your long-term career goals?',
    description:
      'In this question, you are expected to share your vision for your career beyond the first five years. Discuss the milestones you hope to achieve and the specific steps you plan to take to achieve them. You can also mention any plans to pursue higher education or specialized training.',
    category: 'career_goals',
    required: true,
    maxLength: 1000,
    type: 'text'
  },
  {
    id: 'diversity_experience',
    title:
      'Have you ever worked or studied with colleagues from diverse backgrounds, and what have you learned from the experience that you think will aid you as a graduate student in a foreign country?',
    description:
      'Interactions with people from diverse backgrounds provide valuable learning experiences. In your answer to this question, share if you have worked or studied with colleagues from diverse backgrounds and what you learned from the experience. Discuss how the experience will help you as a graduate student in a foreign country.',
    category: 'personal_development',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'extracurricular_activities',
    title:
      'What are your extracurricular activities and how have they helped you develop important skills?',
    description:
      "Your extracurricular activities are an important part of your graduate application. However, it's not just the activities you participated in that matter, but also the skills you developed through them. In your response to this question, highlight the activities that have helped you develop important soft skills such as leadership, communication, and organization.",
    category: 'personal_development',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'leadership_roles',
    title: 'Have you held any leadership roles in your past experiences?',
    description:
      'Being a leader requires a certain set of skills that are highly valued in the professional world. In your response to this question, describe any leadership positions you have held and the specific responsibilities you had. Discuss any accomplishments you achieved during your tenure and the skills you learned or developed as a result of being in that leadership role.',
    category: 'personal_development',
    required: true,
    maxLength: 800,
    type: 'text'
  },
  {
    id: 'social_responsibility',
    title: 'How have you demonstrated social responsibility through your work experiences?',
    description:
      'Please provide examples of events or activities that you have participated in with the goal of improving the lives of underprivileged individuals. This can include volunteer work, community service, or any other relevant experiences that showcase your commitment to social responsibility.',
    category: 'personal_development',
    required: true,
    maxLength: 800,
    type: 'text'
  },
];

export const questionCategories = {
  specialization: {
    title: 'Specialization & Interests',
    description: 'Tell us about your chosen field and what drives you',
  },
  academic_background: {
    title: 'Academic Background',
    description: 'Share your educational journey and achievements',
  },
  professional_experience: {
    title: 'Professional Experience',
    description: 'Detail your work experience and its impact',
  },
  career_goals: {
    title: 'Career Goals',
    description: 'Outline your future aspirations',
  },
  personal_development: {
    title: 'Personal Development',
    description: 'Highlight your growth and extracurricular activities',
  },
};
