import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useCreatePaperDraft } from '../hooks/usePapers';
import { toast } from 'sonner';
import type { Question } from '../backend';

interface SavePaperActionsProps {
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
  disabled?: boolean;
}

export default function SavePaperActions({
  title,
  subject,
  grade,
  questions,
  disabled,
}: SavePaperActionsProps) {
  const navigate = useNavigate();
  const createPaper = useCreatePaperDraft();

  const handleSave = async () => {
    if (!title.trim() || !subject.trim() || !grade.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    try {
      const paper = await createPaper.mutateAsync({
        title: title.trim(),
        subject: subject.trim(),
        grade: grade.trim(),
        questions,
      });
      toast.success('Paper saved successfully!');
      navigate({ to: '/my-papers' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save paper');
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button
        onClick={handleSave}
        disabled={disabled || createPaper.isPending}
        className="gap-2"
      >
        {createPaper.isPending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Paper
          </>
        )}
      </Button>
    </div>
  );
}
