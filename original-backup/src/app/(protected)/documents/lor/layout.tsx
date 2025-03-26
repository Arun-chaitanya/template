import { SubscriptionGuard } from '@/components/common/SubscriptionGuard';

export default function LORLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
} 