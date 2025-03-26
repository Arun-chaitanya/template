import { SubscriptionGuard } from '@/components/common/SubscriptionGuard';

export default function SOPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
} 