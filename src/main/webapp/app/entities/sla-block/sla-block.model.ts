export interface ISLABlock {
  id?: string;
  name?: string | null;
}

export class SLABlock implements ISLABlock {
  constructor(public id?: string, public name?: string | null) {}
}

export function getSLABlockIdentifier(sLABlock: ISLABlock): string | undefined {
  return sLABlock.id;
}
