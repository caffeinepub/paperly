import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Send } from 'lucide-react';
import type { Question } from '../../backend';
import { generateDoubtResponse } from '../../lib/doubtSolver/localDoubtSolver';

interface DoubtSolverPanelProps {
  question: Question;
}

export default function DoubtSolverPanel({ question }: DoubtSolverPanelProps) {
  const [doubt, setDoubt] = useState('');
  const [response, setResponse] = useState<{ correctAnswer: string; explanation: string } | null>(null);

  const handleAskDoubt = () => {
    if (!doubt.trim()) return;
    const result = generateDoubtResponse(question, doubt);
    setResponse(result);
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Doubt Solver
        </CardTitle>
        <CardDescription>
          Ask any question about this problem and get instant help
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type your doubt or question here... (e.g., 'I don't understand this question' or 'Can you explain the answer?')"
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button onClick={handleAskDoubt} disabled={!doubt.trim()} className="w-full gap-2">
            <Send className="h-4 w-4" />
            Get Help
          </Button>
        </div>

        {response && (
          <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                AI Response
              </h4>
              <div className="space-y-3">
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Correct Answer:</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {response.correctAnswer}
                  </p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                  <p className="text-sm leading-relaxed">{response.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
