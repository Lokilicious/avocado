import { IQuestion } from 'app/entities/question/question.model';
import { ISurvey } from 'app/entities/survey/survey.model';

export interface IAnswer {
  id?: string;
  numResponses?: number | null;
  resultNumeric?: number | null;
  resultString?: string | null;
  order?: number | null;
  question?: IQuestion | null;
  survey?: ISurvey | null;
}

export class Answer implements IAnswer {
  constructor(
    public id?: string,
    public numResponses?: number | null,
    public resultNumeric?: number | null,
    public resultString?: string | null,
    public order?: number | null,
    public question?: IQuestion | null,
    public survey?: ISurvey | null
  ) {}
}

export function getAnswerIdentifier(answer: IAnswer): string | undefined {
  return answer.id;
}
