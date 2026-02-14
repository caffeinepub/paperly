import type { QuestionPaper, Question } from '../../backend';

export interface MergedPaperResult {
  questions: Question[];
  suggestedTitle: string;
  suggestedSubject: string;
  suggestedGrade: string;
}

export function mergePapers(papers: QuestionPaper[]): MergedPaperResult {
  if (papers.length === 0) {
    return {
      questions: [],
      suggestedTitle: '',
      suggestedSubject: '',
      suggestedGrade: '',
    };
  }

  // Concatenate all questions in order
  const allQuestions: Question[] = [];
  for (const paper of papers) {
    allQuestions.push(...paper.questions);
  }

  // Suggest metadata based on the first paper
  const firstPaper = papers[0];
  const suggestedTitle = papers.length === 2
    ? `${firstPaper.metadata.title} + ${papers[1].metadata.title}`
    : `Combined Paper (${papers.length} papers)`;

  // Use the most common subject and grade
  const subjects = papers.map((p) => p.metadata.subject);
  const grades = papers.map((p) => p.metadata.grade);

  const suggestedSubject = getMostCommon(subjects) || firstPaper.metadata.subject;
  const suggestedGrade = getMostCommon(grades) || firstPaper.metadata.grade;

  return {
    questions: allQuestions,
    suggestedTitle,
    suggestedSubject,
    suggestedGrade,
  };
}

function getMostCommon(arr: string[]): string {
  if (arr.length === 0) return '';

  const counts: Record<string, number> = {};
  let maxCount = 0;
  let mostCommon = arr[0];

  for (const item of arr) {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      mostCommon = item;
    }
  }

  return mostCommon;
}
