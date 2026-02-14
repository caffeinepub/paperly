import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MergeMetadataFormProps {
  title: string;
  subject: string;
  grade: string;
  onTitleChange: (title: string) => void;
  onSubjectChange: (subject: string) => void;
  onGradeChange: (grade: string) => void;
}

export default function MergeMetadataForm({
  title,
  subject,
  grade,
  onTitleChange,
  onSubjectChange,
  onGradeChange,
}: MergeMetadataFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merged Paper Details</CardTitle>
        <CardDescription>
          Set the metadata for your merged paper
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Original papers will remain unchanged. This creates a new paper.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="merge-title">Paper Title *</Label>
          <Input
            id="merge-title"
            placeholder="e.g., Combined Assessment"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="merge-subject">Subject *</Label>
            <Input
              id="merge-subject"
              placeholder="e.g., Mathematics"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merge-grade">Grade/Class *</Label>
            <Input
              id="merge-grade"
              placeholder="e.g., Grade 10"
              value={grade}
              onChange={(e) => onGradeChange(e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
