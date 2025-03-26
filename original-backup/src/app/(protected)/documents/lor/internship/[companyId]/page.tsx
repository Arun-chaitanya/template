import { LORForm } from '@/components/lor/LORForm';
import { managerLorQuestions } from '@/data/lorQuestions';


interface Props {
  params: {
    companyId: string;
  };
}

export default function InternshipLORPage({ params }: Props) {
  return (
    <LORForm
      type="internship"
      questionSections={managerLorQuestions}
      title="Internship Letter of Recommendation"
      description="Fill in the details for your internship supervisor's letter of recommendation"
      id={params.companyId}
    />
  );
}
