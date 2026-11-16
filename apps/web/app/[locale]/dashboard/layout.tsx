import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <DashboardSidebar />
      <div className="flex-1 min-w-0 px-4 md:px-6 py-6">{children}</div>
    </div>
  );
}
