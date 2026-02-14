import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Merge } from 'lucide-react';
import type { QuestionPaper } from '../backend';

interface MergePapersSelectorProps {
  papers: QuestionPaper[];
  selectedIds: bigint[];
  onSelectionChange: (ids: bigint[]) => void;
  onMerge: () => void;
}

export default function MergePapersSelector({
  papers,
  selectedIds,
  onSelectionChange,
  onMerge,
}: MergePapersSelectorProps) {
  const toggleSelection = (paperId: bigint) => {
    const isSelected = selectedIds.some((id) => id === paperId);
    if (isSelected) {
      onSelectionChange(selectedIds.filter((id) => id !== paperId));
    } else {
      onSelectionChange([...selectedIds, paperId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Papers to Merge</CardTitle>
          <Button
            onClick={onMerge}
            disabled={selectedIds.length < 2}
            className="gap-2"
          >
            <Merge className="h-4 w-4" />
            Merge {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {papers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No papers available to merge. Create some papers first!
          </p>
        ) : (
          <div className="space-y-3">
            {papers.map((paper) => {
              const isSelected = selectedIds.some((id) => id === paper.id);
              return (
                <div
                  key={paper.id.toString()}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
                  }`}
                  onClick={() => toggleSelection(paper.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelection(paper.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{paper.metadata.title}</h4>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{paper.metadata.subject}</span>
                      <span>•</span>
                      <span>{paper.metadata.grade}</span>
                      <span>•</span>
                      <span>{paper.questions.length} questions</span>
                      <span>•</span>
                      <span>{Number(paper.totalMarks)} marks</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
