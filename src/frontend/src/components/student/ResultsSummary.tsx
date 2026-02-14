import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Question } from '../../backend';

interface ResultsSummaryProps {
  questions: Question[];
  answers: Map<number, number>;
  metadata: { title: string; subject: string; grade: string };
  earnedMarks: number;
  totalMarks: number;
  onRestart: () => void;
}

export default function ResultsSummary({
  questions,
  answers,
  metadata,
  earnedMarks,
  totalMarks,
  onRestart,
}: ResultsSummaryProps) {
  const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
  const correctCount = questions.filter(
    (q, i) => answers.get(i) === Number(q.correctAnswer)
  ).length;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 75) return { text: 'Great Job!', color: 'text-blue-600 dark:text-blue-400' };
    if (percentage >= 60) return { text: 'Good Effort!', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Keep Practicing!', color: 'text-orange-600 dark:text-orange-400' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">{performance.text}</CardTitle>
          <CardDescription className="text-lg">
            {metadata.title} • {metadata.subject}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className={`text-4xl font-bold ${performance.color}`}>{percentage}%</div>
              <div className="text-sm text-muted-foreground mt-1">Score</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-4xl font-bold">{earnedMarks}/{totalMarks}</div>
              <div className="text-sm text-muted-foreground mt-1">Marks</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-4xl font-bold">{correctCount}/{questions.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Correct</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Question Review</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const userAnswer = answers.get(index);
                const correctAnswer = Number(question.correctAnswer);
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <Card key={index} className={isCorrect ? 'border-green-500/50' : 'border-red-500/50'}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-base font-medium">
                          Question {index + 1}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                          <Badge variant={isCorrect ? 'default' : 'destructive'}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-sm mt-2">
                        {question.text}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {userAnswer !== undefined && (
                        <div className="text-sm">
                          <span className="font-medium">Your answer: </span>
                          <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {question.options[userAnswer]}
                          </span>
                        </div>
                      )}
                      {!isCorrect && (
                        <div className="text-sm">
                          <span className="font-medium">Correct answer: </span>
                          <span className="text-green-600 dark:text-green-400">
                            {question.options[correctAnswer]}
                          </span>
                        </div>
                      )}
                      {userAnswer === undefined && (
                        <div className="text-sm text-muted-foreground">
                          Not answered
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={onRestart} size="lg" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Start New Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
