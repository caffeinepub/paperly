import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Difficulty, type Question } from '../backend';

interface EditableQuestionListProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
  marksPerQuestion?: number;
}

export default function EditableQuestionList({
  questions,
  onChange,
  marksPerQuestion = 5,
}: EditableQuestionListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];
    onChange(newQuestions);
    setExpandedIndex(targetIndex);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: BigInt(0),
      marks: BigInt(marksPerQuestion),
      difficulty: Difficulty.easy,
    };
    onChange([...questions, newQuestion]);
    setExpandedIndex(questions.length);
  };

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    if (difficulty === Difficulty.easy) return 'Easy';
    if (difficulty === Difficulty.medium) return 'Medium';
    if (difficulty === Difficulty.hard) return 'Hard';
    return 'Unknown';
  };

  const getDifficultyVariant = (difficulty: Difficulty): 'default' | 'secondary' | 'destructive' => {
    if (difficulty === Difficulty.easy) return 'secondary';
    if (difficulty === Difficulty.medium) return 'default';
    return 'destructive';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Questions ({questions.length})
        </h3>
        <Button onClick={addQuestion} variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            No questions yet. Click "Add Question" to start building your paper.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === questions.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">Question {index + 1}</CardTitle>
                        <Badge variant={getDifficultyVariant(question.difficulty)}>
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                        <Badge variant="outline">{Number(question.marks)} marks</Badge>
                      </div>

                      {!isExpanded && question.text && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.text}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      >
                        {isExpanded ? 'Collapse' : 'Edit'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${index}`}>Question Text</Label>
                      <Textarea
                        id={`question-${index}`}
                        value={question.text}
                        onChange={(e) => updateQuestion(index, { text: e.target.value })}
                        placeholder="Enter your question here..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`marks-${index}`}>Marks</Label>
                        <Input
                          id={`marks-${index}`}
                          type="number"
                          min="1"
                          value={Number(question.marks)}
                          onChange={(e) =>
                            updateQuestion(index, { marks: BigInt(parseInt(e.target.value) || 1) })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
                        <select
                          id={`difficulty-${index}`}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={question.difficulty}
                          onChange={(e) => {
                            const value = e.target.value as Difficulty;
                            updateQuestion(index, { difficulty: value });
                          }}
                        >
                          <option value={Difficulty.easy}>Easy</option>
                          <option value={Difficulty.medium}>Medium</option>
                          <option value={Difficulty.hard}>Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Options</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, { options: newOptions });
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                          />
                          <Button
                            variant={Number(question.correctAnswer) === optIndex ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              updateQuestion(index, { correctAnswer: BigInt(optIndex) })
                            }
                          >
                            {Number(question.correctAnswer) === optIndex ? '✓ Correct' : 'Set Correct'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
