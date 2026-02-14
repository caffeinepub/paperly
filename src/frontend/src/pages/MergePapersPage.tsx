import { useState } from 'react';
import { useListAllPapers } from '../hooks/usePapers';
import MergePapersSelector from '../components/MergePapersSelector';
import MergeMetadataForm from '../components/MergeMetadataForm';
import EditableQuestionList from '../components/EditableQuestionList';
import SavePaperActions from '../components/SavePaperActions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mergePapers } from '../lib/merge/mergePapers';
import type { Question } from '../backend';

export default function MergePapersPage() {
  const { data: papers, isLoading } = useListAllPapers();
  const [selectedIds, setSelectedIds] = useState<bigint[]>([]);
  const [mergedQuestions, setMergedQuestions] = useState<Question[]>([]);
  const [mergeTitle, setMergeTitle] = useState('');
  const [mergeSubject, setMergeSubject] = useState('');
  const [mergeGrade, setMergeGrade] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleMerge = () => {
    if (!papers || selectedIds.length < 2) return;

    const selectedPapers = papers.filter((p) => selectedIds.some((id) => id === p.id));
    const merged = mergePapers(selectedPapers);

    setMergedQuestions(merged.questions);
    setMergeTitle(merged.suggestedTitle);
    setMergeSubject(merged.suggestedSubject);
    setMergeGrade(merged.suggestedGrade);
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
    setMergedQuestions([]);
    setSelectedIds([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading papers...</p>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Selection
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2">Merge Preview</h1>
          <p className="text-muted-foreground">
            Review and edit your merged paper before saving
          </p>
        </div>

        <MergeMetadataForm
          title={mergeTitle}
          subject={mergeSubject}
          grade={mergeGrade}
          onTitleChange={setMergeTitle}
          onSubjectChange={setMergeSubject}
          onGradeChange={setMergeGrade}
        />

        <EditableQuestionList
          questions={mergedQuestions}
          onChange={setMergedQuestions}
        />

        <SavePaperActions
          title={mergeTitle}
          subject={mergeSubject}
          grade={mergeGrade}
          questions={mergedQuestions}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Merge Papers</h1>
        <p className="text-muted-foreground">
          Select two or more papers to combine into a new paper
        </p>
      </div>

      <MergePapersSelector
        papers={papers || []}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onMerge={handleMerge}
      />
    </div>
  );
}
