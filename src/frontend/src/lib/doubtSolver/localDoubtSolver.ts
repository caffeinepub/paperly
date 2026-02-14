import type { Question } from '../../backend';

export function generateDoubtResponse(
  question: Question,
  doubtText: string
): { correctAnswer: string; explanation: string } {
  const correctAnswerIndex = Number(question.correctAnswer);
  const correctAnswer = question.options[correctAnswerIndex];
  
  // Generate a contextual explanation based on the question
  const explanation = generateExplanation(question, doubtText);

  return {
    correctAnswer,
    explanation,
  };
}

function generateExplanation(question: Question, doubtText: string): string {
  const correctAnswerIndex = Number(question.correctAnswer);
  const correctAnswer = question.options[correctAnswerIndex];
  const difficulty = question.difficulty;

  // Generate explanation based on difficulty and question context
  const explanations: string[] = [];

  // Add difficulty-specific context
  if (difficulty === 'easy') {
    explanations.push(
      `This is a fundamental question that tests basic understanding. The correct answer is "${correctAnswer}".`
    );
  } else if (difficulty === 'medium') {
    explanations.push(
      `This question requires a good understanding of the concept. The correct answer is "${correctAnswer}".`
    );
  } else {
    explanations.push(
      `This is a challenging question that tests deeper understanding. The correct answer is "${correctAnswer}".`
    );
  }

  // Add question-specific guidance
  explanations.push(
    `Looking at the question "${question.text}", we need to carefully consider each option.`
  );

  // Add reasoning about why this is correct
  explanations.push(
    `Option "${correctAnswer}" is correct because it directly addresses what the question is asking for. ` +
    `The other options, while they may seem plausible, don't fully satisfy the requirements of the question.`
  );

  // Add study tip based on difficulty
  if (difficulty === 'hard') {
    explanations.push(
      `For complex questions like this, it's helpful to break down the problem into smaller parts and eliminate obviously incorrect options first.`
    );
  } else {
    explanations.push(
      `Remember to read the question carefully and consider what concept or principle it's testing.`
    );
  }

  return explanations.join(' ');
}
