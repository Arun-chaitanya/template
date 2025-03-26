import { SubscriptionGuard } from '@/components/common/SubscriptionGuard';

export default function EssayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
} 