import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';

export default function PapersEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No papers yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          You haven't created any question papers yet. Start by generating your first paper!
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Your First Paper
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
