import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISLABlock, getSLABlockIdentifier } from '../sla-block.model';

export type EntityResponseType = HttpResponse<ISLABlock>;
export type EntityArrayResponseType = HttpResponse<ISLABlock[]>;

@Injectable({ providedIn: 'root' })
export class SLABlockService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sla-blocks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sLABlock: ISLABlock): Observable<EntityResponseType> {
    return this.http.post<ISLABlock>(this.resourceUrl, sLABlock, { observe: 'response' });
  }

  update(sLABlock: ISLABlock): Observable<EntityResponseType> {
    return this.http.put<ISLABlock>(`${this.resourceUrl}/${getSLABlockIdentifier(sLABlock) as string}`, sLABlock, { observe: 'response' });
  }

  partialUpdate(sLABlock: ISLABlock): Observable<EntityResponseType> {
    return this.http.patch<ISLABlock>(`${this.resourceUrl}/${getSLABlockIdentifier(sLABlock) as string}`, sLABlock, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISLABlock>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISLABlock[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSLABlockToCollectionIfMissing(sLABlockCollection: ISLABlock[], ...sLABlocksToCheck: (ISLABlock | null | undefined)[]): ISLABlock[] {
    const sLABlocks: ISLABlock[] = sLABlocksToCheck.filter(isPresent);
    if (sLABlocks.length > 0) {
      const sLABlockCollectionIdentifiers = sLABlockCollection.map(sLABlockItem => getSLABlockIdentifier(sLABlockItem)!);
      const sLABlocksToAdd = sLABlocks.filter(sLABlockItem => {
        const sLABlockIdentifier = getSLABlockIdentifier(sLABlockItem);
        if (sLABlockIdentifier == null || sLABlockCollectionIdentifiers.includes(sLABlockIdentifier)) {
          return false;
        }
        sLABlockCollectionIdentifiers.push(sLABlockIdentifier);
        return true;
      });
      return [...sLABlocksToAdd, ...sLABlockCollection];
    }
    return sLABlockCollection;
  }
}
