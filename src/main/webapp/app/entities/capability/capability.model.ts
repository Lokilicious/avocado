import { ITeam } from 'app/entities/team/team.model';

export interface ICapability {
  id?: string;
  name?: string | null;
  teams?: ITeam[] | null;
}

export class Capability implements ICapability {
  constructor(public id?: string, public name?: string | null, public teams?: ITeam[] | null) {}
}

export function getCapabilityIdentifier(capability: ICapability): string | undefined {
  return capability.id;
}
