import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

export interface PaperParams {
  title: string;
  subject: string;
  grade: string;
  numQuestions: number;
  marksPerQuestion: number;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
}

interface PaperParamsFormProps {
  onGenerate: (params: PaperParams) => void;
  isGenerating?: boolean;
}

export default function PaperParamsForm({ onGenerate, isGenerating }: PaperParamsFormProps) {
  const [params, setParams] = useState<PaperParams>({
    title: '',
    subject: '',
    grade: '',
    numQuestions: 10,
    marksPerQuestion: 5,
    easyPercent: 40,
    mediumPercent: 40,
    hardPercent: 20,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(params);
  };

  const updateParam = (key: keyof PaperParams, value: string | number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paper Parameters</CardTitle>
        <CardDescription>Configure your question paper settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Paper Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Mid-Term Examination"
                value={params.title}
                onChange={(e) => updateParam('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={params.subject}
                onChange={(e) => updateParam('subject', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Class *</Label>
              <Input
                id="grade"
                placeholder="e.g., Grade 10"
                value={params.grade}
                onChange={(e) => updateParam('grade', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numQuestions">Number of Questions *</Label>
              <Input
                id="numQuestions"
                type="number"
                min="1"
                value={params.numQuestions}
                onChange={(e) => updateParam('numQuestions', parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marksPerQuestion">Marks per Question *</Label>
              <Input
                id="marksPerQuestion"
                type="number"
                min="1"
                value={params.marksPerQuestion}
                onChange={(e) => updateParam('marksPerQuestion', parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Difficulty Distribution (%)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="easy" className="text-sm text-muted-foreground">
                  Easy
                </Label>
                <Input
                  id="easy"
                  type="number"
                  min="0"
                  max="100"
                  value={params.easyPercent}
                  onChange={(e) => updateParam('easyPercent', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium" className="text-sm text-muted-foreground">
                  Medium
                </Label>
                <Input
                  id="medium"
                  type="number"
                  min="0"
                  max="100"
                  value={params.mediumPercent}
                  onChange={(e) => updateParam('mediumPercent', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hard" className="text-sm text-muted-foreground">
                  Hard
                </Label>
                <Input
                  id="hard"
                  type="number"
                  min="0"
                  max="100"
                  value={params.hardPercent}
                  onChange={(e) => updateParam('hardPercent', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {params.easyPercent + params.mediumPercent + params.hardPercent}% (should equal 100%)
            </p>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Paper
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
