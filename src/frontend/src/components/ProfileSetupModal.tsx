import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/usePapers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../backend';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!role) {
      toast.error('Please select your role');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim(), role });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Paperly!</DialogTitle>
          <DialogDescription>
            Please tell us your name and role to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Select Your Role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent transition-colors">
                <RadioGroupItem value={UserRole.teacher} id="teacher" />
                <Label htmlFor="teacher" className="flex-1 cursor-pointer font-normal">
                  <div className="font-semibold">Teacher</div>
                  <div className="text-sm text-muted-foreground">Create and manage question papers</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent transition-colors">
                <RadioGroupItem value={UserRole.student} id="student" />
                <Label htmlFor="student" className="flex-1 cursor-pointer font-normal">
                  <div className="font-semibold">Student</div>
                  <div className="text-sm text-muted-foreground">Practice with AI-generated papers</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {role === UserRole.student && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Warning for students:</strong> Do not use a Teacher account. If you use a Teacher account, you will be banned permanently.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
