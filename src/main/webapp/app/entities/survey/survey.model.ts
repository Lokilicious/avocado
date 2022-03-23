import dayjs from 'dayjs/esm';
import { IAnswer } from 'app/entities/answer/answer.model';
import { ITeam } from 'app/entities/team/team.model';

export interface ISurvey {
  id?: string;
  surveyDate?: dayjs.Dayjs | null;
  createdDate?: dayjs.Dayjs | null;
  answers?: IAnswer[] | null;
  team?: ITeam | null;
}

export class Survey implements ISurvey {
  constructor(
    public id?: string,
    public surveyDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public answers?: IAnswer[] | null,
    public team?: ITeam | null
  ) {}
}

export function getSurveyIdentifier(survey: ISurvey): string | undefined {
  return survey.id;
}
