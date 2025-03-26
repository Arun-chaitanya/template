import { LORForm } from '@/components/lor/LORForm';
import { profLorQuestions } from '@/data/lorQuestions';


interface Props {
  params: {
    professorId: string;
  };
}

export default function ProfessorLORPage({ params }: Props) {
  return (
    <LORForm
      type="professor"
      questionSections={profLorQuestions}
      title="Professor Letter of Recommendation"
      description="Fill in the details for your professor's letter of recommendation"
      id={params.professorId}
    />
  );
}
