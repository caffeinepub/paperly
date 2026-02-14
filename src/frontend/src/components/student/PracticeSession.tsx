import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import type { Question } from '../../backend';
import ResultsSummary from './ResultsSummary';
import DoubtSolverPanel from './DoubtSolverPanel';

interface PracticeSessionProps {
  questions: Question[];
  metadata: { title: string; subject: string; grade: string };
  onExit: () => void;
}

export default function PracticeSession({ questions, metadata, onExit }: PracticeSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDoubtSolver, setShowDoubtSolver] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers.get(currentQuestionIndex);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    if (!isSubmitted) {
      setAnswers(new Map(answers.set(currentQuestionIndex, optionIndex)));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowDoubtSolver(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowDoubtSolver(false);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    let totalMarks = 0;
    let earnedMarks = 0;

    questions.forEach((question, index) => {
      const marks = Number(question.marks);
      totalMarks += marks;
      const answer = answers.get(index);
      if (answer !== undefined && answer === Number(question.correctAnswer)) {
        earnedMarks += marks;
      }
    });

    return { earnedMarks, totalMarks };
  };

  if (isSubmitted) {
    const { earnedMarks, totalMarks } = calculateScore();
    return (
      <ResultsSummary
        questions={questions}
        answers={answers}
        metadata={metadata}
        earnedMarks={earnedMarks}
        totalMarks={totalMarks}
        onRestart={onExit}
      />
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{metadata.title}</h1>
            <p className="text-sm text-muted-foreground">
              {metadata.subject} • {metadata.grade}
            </p>
          </div>
          <Button variant="outline" onClick={onExit}>
            Exit
          </Button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-muted-foreground">
              {answers.size} / {questions.length} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {currentQuestion.text}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">{Number(currentQuestion.marks)} marks</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowDoubtSolver(!showDoubtSolver)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              {showDoubtSolver ? 'Hide' : 'Ask'} Doubt Solver
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button onClick={handleSubmit} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Submit
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showDoubtSolver && (
        <DoubtSolverPanel question={currentQuestion} />
      )}
    </div>
  );
}
