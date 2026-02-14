import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPaper } from '../hooks/usePapers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditableQuestionList from '../components/EditableQuestionList';
import SavePaperActions from '../components/SavePaperActions';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import type { Question } from '../backend';

export default function PaperDetailPage() {
  const { paperId } = useParams({ from: '/paper/$paperId' });
  const navigate = useNavigate();
  const { data: paper, isLoading } = useGetPaper(BigInt(paperId));
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Paper Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The paper you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => navigate({ to: '/my-papers' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Papers
        </Button>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditedQuestions([...paper.questions]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedQuestions([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/my-papers' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{paper.metadata.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{paper.metadata.subject}</Badge>
                <Badge variant="secondary">{paper.metadata.grade}</Badge>
                <Badge variant="outline">{paper.questions.length} questions</Badge>
                <Badge variant="outline">{Number(paper.totalMarks)} marks</Badge>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={handleStartEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit & Save As New
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {isEditing ? (
        <div className="space-y-6">
          <EditableQuestionList
            questions={editedQuestions}
            onChange={setEditedQuestions}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <SavePaperActions
              title={`${paper.metadata.title} (Copy)`}
              subject={paper.metadata.subject}
              grade={paper.metadata.grade}
              questions={editedQuestions}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {paper.questions.map((question, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                  <Badge variant="outline">{Number(question.marks)} marks</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{question.text}</p>
                {question.options.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Options:</p>
                    <ul className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={`text-sm pl-4 ${
                            Number(question.correctAnswer) === optIndex
                              ? 'font-medium text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {optIndex + 1}. {option}
                          {Number(question.correctAnswer) === optIndex && ' ✓'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
