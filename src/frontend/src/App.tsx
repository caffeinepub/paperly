import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/usePapers';
import AppLayout from './components/AppLayout';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import RoleGuard from './components/RoleGuard';
import GeneratePaperPage from './pages/GeneratePaperPage';
import MyPapersPage from './pages/MyPapersPage';
import PaperDetailPage from './pages/PaperDetailPage';
import MergePapersPage from './pages/MergePapersPage';
import StudentPortalPage from './pages/StudentPortalPage';
import { UserRole } from './backend';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <RoleGuard allowedRoles={[UserRole.teacher]}>
      <GeneratePaperPage />
    </RoleGuard>
  ),
});

const myPapersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-papers',
  component: () => (
    <RoleGuard allowedRoles={[UserRole.teacher]}>
      <MyPapersPage />
    </RoleGuard>
  ),
});

const paperDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/paper/$paperId',
  component: () => (
    <RoleGuard allowedRoles={[UserRole.teacher]}>
      <PaperDetailPage />
    </RoleGuard>
  ),
});

const mergePapersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/merge',
  component: () => (
    <RoleGuard allowedRoles={[UserRole.teacher]}>
      <MergePapersPage />
    </RoleGuard>
  ),
});

const studentPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student',
  component: () => (
    <RoleGuard allowedRoles={[UserRole.student]}>
      <StudentPortalPage />
    </RoleGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  myPapersRoute,
  paperDetailRoute,
  mergePapersRoute,
  studentPortalRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}
