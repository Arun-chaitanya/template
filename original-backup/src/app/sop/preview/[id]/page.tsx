import { prisma } from '@/lib/prisma';
import styles from '@/styles/components/SOPPreview.module.scss';

export default async function SOPPreview({ params }: { params: { id: string } }) {
  const sop = await prisma.sop.findUnique({
    where: { id: params.id }
  });

  if (!sop) {
    return <div>SOP not found</div>;
  }

  return (
    <div className={styles.preview}>
      <div className={styles.controls}>
        <button onClick={() => window.print()}>Download PDF</button>
        <button>Edit</button>
      </div>
      
      <div className={styles.document}>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sop.content }} />
      </div>
    </div>
  );
} 