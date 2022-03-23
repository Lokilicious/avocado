import { ISLABlock } from 'app/entities/sla-block/sla-block.model';

export interface IQuestion {
  id?: string;
  text?: string | null;
  slaBlock?: ISLABlock | null;
}

export class Question implements IQuestion {
  constructor(public id?: string, public text?: string | null, public slaBlock?: ISLABlock | null) {}
}

export function getQuestionIdentifier(question: IQuestion): string | undefined {
  return question.id;
}
