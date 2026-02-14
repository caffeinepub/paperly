import { useGetCallerUserProfile } from '../hooks/usePapers';
import { UserRole } from '../backend';
import RoleAccessDenied from './RoleAccessDenied';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile || !allowedRoles.includes(userProfile.role)) {
    return <RoleAccessDenied userRole={userProfile?.role} allowedRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
