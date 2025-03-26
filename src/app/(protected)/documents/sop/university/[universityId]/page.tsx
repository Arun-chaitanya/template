import { UniversitySOPEditor } from '@/components/sop/university/UniversitySOPEditor';

interface Props {
  params: {
    universityId: string;
  };
}

export default function UniversitySOPPage({ params }: Props) {
  return <UniversitySOPEditor universityId={params.universityId} />;
}
