export class GameAnswerDto {
  answer: string;
  isCorrect: boolean;
  totalTime: number;
  time_taken: number;
  nextQuestion?: object;
}
