import { LORForm } from '@/components/lor/LORForm';
import { managerLorQuestions } from '@/data/lorQuestions';

interface Props {
  params: {
    companyId: string;
  };
}

export default function CompanyLORPage({ params }: Props) {
  return (
    <LORForm
      type="company"
      questionSections={managerLorQuestions}
      title="Company Letter of Recommendation"
      description="Fill in the details for your company manager's letter of recommendation"
      id={params.companyId}
    />
  );
}
