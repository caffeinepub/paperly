import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play } from 'lucide-react';
import PaperParamsForm, { type PaperParams } from '../components/PaperParamsForm';
import PracticeSession from '../components/student/PracticeSession';
import { generateQuestions } from '../lib/generator/paperGenerator';
import type { Question } from '../backend';

export default function StudentPortalPage() {
  const [practiceQuestions, setPracticeQuestions] = useState<Question[] | null>(null);
  const [paperMetadata, setPaperMetadata] = useState<{ title: string; subject: string; grade: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (params: PaperParams) => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const questions = generateQuestions(params);
      setPracticeQuestions(questions);
      setPaperMetadata({
        title: params.title,
        subject: params.subject,
        grade: params.grade,
      });
      setIsGenerating(false);
    }, 500);
  };

  const handleReset = () => {
    setPracticeQuestions(null);
    setPaperMetadata(null);
  };

  if (practiceQuestions && paperMetadata) {
    return (
      <PracticeSession
        questions={practiceQuestions}
        metadata={paperMetadata}
        onExit={handleReset}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Student Portal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Practice with AI-generated question papers and get instant help with our doubt solver
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Generate Practice Paper
          </CardTitle>
          <CardDescription>
            Configure your practice session parameters and start solving questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaperParamsForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </CardContent>
      </Card>
    </div>
  );
}
