import { QuestionSection } from '@/types/questions';

export const profLorQuestions: QuestionSection[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Basic details about the faculty member',
    questions: [
      {
        id: 'facultyName',
        title: 'Name of the faculty member',
        type: 'text',
        required: true,
      },
      {
        id: 'designation',
        title: 'Designation',
        type: 'text',
        required: true,
      },
      {
        id: 'department',
        title: 'Department',
        type: 'text',
        required: true,
      },
      {
        id: 'college',
        title: 'College',
        type: 'text',
        required: true,
      },
      {
        id: 'duration',
        title: 'Duration of association (from DD/MM/YYYY to DD/MM/YYYY)',
        type: 'date',
        required: true,
      },
    ],
  },
  {
    id: 'academic-info',
    title: 'Academic Information',
    description: 'Course and academic details',
    questions: [
      {
        id: 'courses',
        title:
          'List the courses handled by the Professor in the following format: Course: Semester: Your grades: Were you one of the high scorers in this course: Yes/No',
        type: 'text',
        required: true,
      },
      {
        id: 'classParticipation',
        title: 'How would he/she view your participation in class? Please explain.',
        type: 'text',
        required: true,
      },
      {
        id: 'studentDescription',
        title: 'According to you, how would he/she describe you as a student?',
        type: 'text',
        required: true,
      },
      {
        id: 'subjectKnowledge',
        title:
          'What would he/she say about your depth of knowledge in the subjects that he/she taught you?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'presentations',
    title: 'Presentations & Labs',
    description: 'Information about presentations and laboratory work',
    questions: [
      {
        id: 'presentations',
        title: 'Have you taken presentations or seminars in class? Please give the details.',
        type: 'text',
        required: false,
      },
      {
        id: 'presentationPerformance',
        title: 'If you have, how will the Prof describe your performance?',
        type: 'text',
        required: false,
      },
      {
        id: 'labSessions',
        title: 'Did he/she handle any Lab sessions?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'labDetails',
        title: 'If yes, then list the labs, grade and their respective semesters.',
        type: 'text',
        required: false,
      },
      {
        id: 'labInvolvement',
        title: 'How would he/she view your work and involvement in the Labs?',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    id: 'additional-activities',
    title: 'Additional Activities',
    description: 'Extra-curricular and other achievements',
    questions: [
      {
        id: 'extraCurricular',
        title: 'Will the Prof be aware of your extra-curricular activities?',
        type: 'text',
        required: false,
      },
      {
        id: 'events',
        title:
          'List the events you were involved in that the Prof is likely to know you have participated in. For example: - Paper presentation, even organization, representing college in competition, etc.',
        type: 'text',
        required: false,
      },
      {
        id: 'specialAchievements',
        title:
          'Is there a specific incident or award that you received for which the Prof appreciated you? (For e.g. Your final year project work)',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    id: 'ratings',
    title: 'Performance Ratings',
    description: "Professor's likely ratings on various aspects",
    questions: [
      {
        id: 'analyticalRating',
        title: 'Analytical Skills Rating',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'problemSolvingRating',
        title: 'Problem Solving Ability Rating',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'subjectKnowledgeRating',
        title: 'Subject Knowledge Rating',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'communicationRating',
        title: 'Communication Ability Rating (eg. Seminars and presentations)',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'examPerformanceRating',
        title: 'How would your Prof rate your performance in exams and assignments?',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
    ],
  },
];

export const managerLorQuestions: QuestionSection[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Basic details about the manager and organization',
    questions: [
      {
        id: 'managerName',
        title: 'Name of the manager',
        type: 'text',
        required: true,
      },
      {
        id: 'department',
        title: 'Department or Team',
        type: 'text',
        required: true,
      },
      {
        id: 'departmentResponsibility',
        title: 'What is the department responsible for?',
        type: 'text',
        required: true,
      },
      {
        id: 'organization',
        title: 'Organization',
        type: 'text',
        required: true,
      },
      {
        id: 'organizationDescription',
        title: 'Brief description of the organization (nature of business, size, customers etc)',
        type: 'text',
        required: true,
      },
      {
        id: 'duration',
        title: 'Duration of association (from DD/MM/YYYY to DD/MM/YYYY)',
        type: 'date',
        required: true,
      },
      {
        id: 'designation',
        title: 'Your Designation',
        type: 'text',
        required: true,
      },
      {
        id: 'directSupervision',
        title: 'Did the manager directly monitor and assess your performance?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: true,
      },
    ],
  },
  {
    id: 'project-info',
    title: 'Project Information',
    description: 'Details about projects and contributions',
    questions: [
      {
        id: 'projectDetails',
        title:
          'For each project kindly use the following format: Name of the Project: Client Why was this project important/Crucial What was your contribution? Why would he/she appreciate your efforts? If he/she were to talk about this in your favor, how would he/she describe it?',
        type: 'text',
        required: true,
      },
      {
        id: 'skills',
        title:
          'What are the skills or domain knowledge that your Manager appreciated you for? (For example: Programming Languages, packages, Tools, Domains, subject areas, processes etc.)',
        type: 'text',
        required: true,
      },
      {
        id: 'professionalDescription',
        title: 'How would the Manager describe you as a professional?',
        type: 'text',
        required: true,
      },
      {
        id: 'appreciatedTraits',
        title:
          'Mention the professional traits and qualities you were appreciated for by the Manager. Mention why the specified qualities and traits were appreciated by him/her.',
        type: 'text',
        required: true,
      },
      {
        id: 'awards',
        title:
          'Did you receive awards/recognitions/promotions/assignments from your Manager and receive appreciation from him/her for the same?',
        type: 'text',
        required: true,
      },
      {
        id: 'extraActivities',
        title:
          'Were you involved in any other work or activity beyond your official projects? (Example: Corporate Social Responsibility, Outreach task, Sports, Process Champion, etc).',
        type: 'text',
        required: true,
      },
      {
        id: 'ranking',
        title:
          'How would the manager rate you amongst all the professionals at your level that he/she must have associated with? Top _____ %',
        type: 'text',
        required: true,
      },
      {
        id: 'additionalInfo',
        title:
          'Is there anything specific at the work-place that you would like the Manager to consider/talk about in the LOR?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'ratings',
    title: 'Skills Rating',
    description: "Manager's rating on various professional aspects",
    questions: [
      {
        id: 'technicalExpertiseRating',
        title: 'How would he/she rate your technical expertise, domain knowledge?',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'communicationRating',
        title: 'Strong Communication skills',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'interpersonalRating',
        title: 'Strong interpersonal skills',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'teamworkRating',
        title: 'Collaboration and Team work',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'initiativeRating',
        title: 'Initiative',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'leadershipRating',
        title: 'Leadership',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'customerManagementRating',
        title: 'Customer Management',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'projectManagementRating',
        title: 'Project Management',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'trainingMentoringRating',
        title: 'Training and Mentoring',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'adaptabilityRating',
        title: 'Adaptability',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'versatilityRating',
        title: 'Versatility',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'emotionalMaturityRating',
        title: 'Emotional Maturity',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'stressManagementRating',
        title: 'Ability to work under stress',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
      {
        id: 'supervisionRating',
        title: 'Need for low supervision',
        type: 'scale',
        scale: {
          min: 0,
          max: 10,
          step: 1,
        },
        required: true,
      },
    ],
  },
];

export const companyLorQuestions: QuestionSection[] = [
  // ... existing managerLorQuestions ...
];

export const internshipLorQuestions: QuestionSection[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Basic details about the supervisor and organization',
    questions: [
      {
        id: 'supervisorName',
        title: 'Name of the supervisor',
        type: 'text',
        required: true,
      },
      // ... similar to managerLorQuestions but with internship-specific modifications
    ],
  },
  // ... other sections adapted for internship context
];
