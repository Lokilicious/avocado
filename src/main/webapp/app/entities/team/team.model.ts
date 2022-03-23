import dayjs from 'dayjs/esm';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ICapability } from 'app/entities/capability/capability.model';

export interface ITeam {
  id?: string;
  name?: string | null;
  advocate?: string | null;
  coach?: string | null;
  currentlyCoached?: boolean | null;
  numMembers?: number | null;
  createdDate?: dayjs.Dayjs | null;
  surveys?: ISurvey[] | null;
  capability?: ICapability | null;
}

export class Team implements ITeam {
  constructor(
    public id?: string,
    public name?: string | null,
    public advocate?: string | null,
    public coach?: string | null,
    public currentlyCoached?: boolean | null,
    public numMembers?: number | null,
    public createdDate?: dayjs.Dayjs | null,
    public surveys?: ISurvey[] | null,
    public capability?: ICapability | null
  ) {
    this.currentlyCoached = this.currentlyCoached ?? false;
  }
}

export function getTeamIdentifier(team: ITeam): string | undefined {
  return team.id;
}
