import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, GraduationCap, BookOpen } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { UserRole } from '../backend';

interface RoleAccessDeniedProps {
  userRole?: UserRole;
  allowedRoles: UserRole[];
}

export default function RoleAccessDenied({ userRole, allowedRoles }: RoleAccessDeniedProps) {
  const navigate = useNavigate();

  const isTeacherOnly = allowedRoles.includes(UserRole.teacher) && !allowedRoles.includes(UserRole.student);
  const isStudentOnly = allowedRoles.includes(UserRole.student) && !allowedRoles.includes(UserRole.teacher);

  const handleNavigate = () => {
    if (userRole === UserRole.teacher) {
      navigate({ to: '/' });
    } else if (userRole === UserRole.student) {
      navigate({ to: '/student' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[600px] px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            {isTeacherOnly && (
              <span>This page is only accessible to teachers.</span>
            )}
            {isStudentOnly && (
              <span>This page is only accessible to students.</span>
            )}
            {!isTeacherOnly && !isStudentOnly && (
              <span>You don't have permission to access this page.</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {userRole === UserRole.teacher ? (
                <>
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium">Your role: Teacher</span>
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="font-medium">Your role: Student</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isTeacherOnly && userRole === UserRole.student && (
                "As a student, you can access the Student Portal to practice with AI-generated question papers."
              )}
              {isStudentOnly && userRole === UserRole.teacher && (
                "As a teacher, you can access the paper generation and management tools."
              )}
            </p>
          </div>
          <Button onClick={handleNavigate} className="w-full">
            Go to {userRole === UserRole.teacher ? 'Teacher Dashboard' : 'Student Portal'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
