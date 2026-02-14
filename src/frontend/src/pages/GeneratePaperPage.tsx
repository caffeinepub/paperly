import { useState } from 'react';
import PaperParamsForm, { type PaperParams } from '../components/PaperParamsForm';
import EditableQuestionList from '../components/EditableQuestionList';
import SavePaperActions from '../components/SavePaperActions';
import { generateQuestions } from '../lib/generator/paperGenerator';
import type { Question } from '../backend';

export default function GeneratePaperPage() {
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [paperParams, setPaperParams] = useState<PaperParams | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (params: PaperParams) => {
    setIsGenerating(true);
    setPaperParams(params);

    // Simulate generation delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const questions = generateQuestions(params);
    setGeneratedQuestions(questions);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <img
          src="/assets/generated/paperly-hero.dim_1600x600.png"
          alt="Paperly Hero"
          className="w-full max-w-4xl mx-auto rounded-lg shadow-sm"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">Generate Question Paper</h1>
          <p className="text-muted-foreground">
            Create unlimited question papers with customizable parameters
          </p>
        </div>
      </div>

      <PaperParamsForm onGenerate={handleGenerate} isGenerating={isGenerating} />

      {generatedQuestions.length > 0 && paperParams && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{paperParams.title}</h2>
              <p className="text-muted-foreground">
                {paperParams.subject} • {paperParams.grade}
              </p>
            </div>
            <SavePaperActions
              title={paperParams.title}
              subject={paperParams.subject}
              grade={paperParams.grade}
              questions={generatedQuestions}
            />
          </div>

          <EditableQuestionList
            questions={generatedQuestions}
            onChange={setGeneratedQuestions}
            marksPerQuestion={paperParams.marksPerQuestion}
          />

          <SavePaperActions
            title={paperParams.title}
            subject={paperParams.subject}
            grade={paperParams.grade}
            questions={generatedQuestions}
          />
        </div>
      )}
    </div>
  );
}
