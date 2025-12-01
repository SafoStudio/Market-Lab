import { RouteGuard } from '@/components/features/auth/RouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </RouteGuard>
  );
}