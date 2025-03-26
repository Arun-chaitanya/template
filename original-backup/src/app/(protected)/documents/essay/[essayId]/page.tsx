'use client';

import { use } from 'react';
import { EssayEditor } from '@/components/essay/EssayEditor';

interface EssayPageProps {
  params: Promise<{
    essayId: string;
  }>;
}

export default function EditEssayPage({ params }: EssayPageProps) {
  const resolvedParams = use(params);
  return <EssayEditor essayId={resolvedParams.essayId} />;
}
