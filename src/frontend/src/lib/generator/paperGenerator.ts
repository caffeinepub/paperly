import { Difficulty, type Question } from '../../backend';
import type { PaperParams } from '../../components/PaperParamsForm';

const sampleQuestions = {
  easy: [
    'What is the sum of 5 and 7?',
    'Define the term "photosynthesis".',
    'Name the capital city of France.',
    'What is 10 multiplied by 3?',
    'Identify the primary colors.',
    'What is the boiling point of water in Celsius?',
    'Name the largest planet in our solar system.',
    'What is the square root of 16?',
    'Define a noun.',
    'What is the chemical symbol for water?',
  ],
  medium: [
    'Explain the process of mitosis.',
    'Calculate the area of a circle with radius 5 cm.',
    'Describe the water cycle in detail.',
    'Solve for x: 2x + 5 = 15',
    'What are the three states of matter?',
    'Explain Newton\'s first law of motion.',
    'What is the difference between weather and climate?',
    'Calculate 15% of 200.',
    'Describe the structure of an atom.',
    'What is the Pythagorean theorem?',
  ],
  hard: [
    'Derive the quadratic formula from first principles.',
    'Analyze the causes and effects of the Industrial Revolution.',
    'Prove that the sum of angles in a triangle equals 180 degrees.',
    'Explain the theory of relativity in simple terms.',
    'Discuss the impact of climate change on biodiversity.',
    'Solve the differential equation: dy/dx = 2x',
    'Compare and contrast mitosis and meiosis.',
    'Evaluate the integral of x² from 0 to 5.',
    'Explain the concept of natural selection.',
    'Analyze the themes in Shakespeare\'s Hamlet.',
  ],
};

const sampleOptions = [
  ['Option A', 'Option B', 'Option C', 'Option D'],
  ['First choice', 'Second choice', 'Third choice', 'Fourth choice'],
  ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
  ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
];

export function generateQuestions(params: PaperParams): Question[] {
  const questions: Question[] = [];
  const total = params.easyPercent + params.mediumPercent + params.hardPercent;

  if (total === 0) {
    // Default distribution if percentages are all zero
    const easyCount = Math.floor(params.numQuestions * 0.4);
    const mediumCount = Math.floor(params.numQuestions * 0.4);
    const hardCount = params.numQuestions - easyCount - mediumCount;

    for (let i = 0; i < easyCount; i++) {
      questions.push(createQuestion(Difficulty.easy, params.marksPerQuestion, i));
    }
    for (let i = 0; i < mediumCount; i++) {
      questions.push(createQuestion(Difficulty.medium, params.marksPerQuestion, i));
    }
    for (let i = 0; i < hardCount; i++) {
      questions.push(createQuestion(Difficulty.hard, params.marksPerQuestion, i));
    }
  } else {
    // Use specified distribution
    const easyCount = Math.round((params.numQuestions * params.easyPercent) / 100);
    const mediumCount = Math.round((params.numQuestions * params.mediumPercent) / 100);
    const hardCount = params.numQuestions - easyCount - mediumCount;

    for (let i = 0; i < easyCount; i++) {
      questions.push(createQuestion(Difficulty.easy, params.marksPerQuestion, i));
    }
    for (let i = 0; i < mediumCount; i++) {
      questions.push(createQuestion(Difficulty.medium, params.marksPerQuestion, i));
    }
    for (let i = 0; i < hardCount; i++) {
      questions.push(createQuestion(Difficulty.hard, params.marksPerQuestion, i));
    }
  }

  return questions;
}

function createQuestion(
  difficulty: Difficulty,
  marks: number,
  index: number
): Question {
  const difficultyKey = difficulty === Difficulty.easy ? 'easy' : difficulty === Difficulty.medium ? 'medium' : 'hard';
  const questionPool = sampleQuestions[difficultyKey];
  const questionText = questionPool[index % questionPool.length];
  const options = sampleOptions[index % sampleOptions.length];
  const correctAnswer = index % 4;

  return {
    text: questionText,
    options,
    correctAnswer: BigInt(correctAnswer),
    marks: BigInt(marks),
    difficulty,
  };
}
