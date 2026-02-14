import { Link } from '@tanstack/react-router';
import { useListAllPapers } from '../hooks/usePapers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PapersEmptyState from '../components/PapersEmptyState';
import { FileText, Eye, Merge } from 'lucide-react';

export default function MyPapersPage() {
  const { data: papers, isLoading } = useListAllPapers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your papers...</p>
        </div>
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <PapersEmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Papers</h1>
          <p className="text-muted-foreground">
            {papers.length} {papers.length === 1 ? 'paper' : 'papers'} created
          </p>
        </div>
        <Link to="/merge">
          <Button variant="outline" className="gap-2">
            <Merge className="h-4 w-4" />
            Merge Papers
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers.map((paper) => (
          <Card key={paper.id.toString()} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{paper.metadata.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{paper.metadata.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="font-medium">{paper.metadata.grade}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="secondary">{paper.questions.length} questions</Badge>
                <Badge variant="outline">{Number(paper.totalMarks)} marks</Badge>
              </div>

              <Link to="/paper/$paperId" params={{ paperId: paper.id.toString() }}>
                <Button className="w-full gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
