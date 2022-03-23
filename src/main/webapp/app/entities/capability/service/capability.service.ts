import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICapability, getCapabilityIdentifier } from '../capability.model';

export type EntityResponseType = HttpResponse<ICapability>;
export type EntityArrayResponseType = HttpResponse<ICapability[]>;

@Injectable({ providedIn: 'root' })
export class CapabilityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/capabilities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(capability: ICapability): Observable<EntityResponseType> {
    return this.http.post<ICapability>(this.resourceUrl, capability, { observe: 'response' });
  }

  update(capability: ICapability): Observable<EntityResponseType> {
    return this.http.put<ICapability>(`${this.resourceUrl}/${getCapabilityIdentifier(capability) as string}`, capability, {
      observe: 'response',
    });
  }

  partialUpdate(capability: ICapability): Observable<EntityResponseType> {
    return this.http.patch<ICapability>(`${this.resourceUrl}/${getCapabilityIdentifier(capability) as string}`, capability, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICapability>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICapability[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCapabilityToCollectionIfMissing(
    capabilityCollection: ICapability[],
    ...capabilitiesToCheck: (ICapability | null | undefined)[]
  ): ICapability[] {
    const capabilities: ICapability[] = capabilitiesToCheck.filter(isPresent);
    if (capabilities.length > 0) {
      const capabilityCollectionIdentifiers = capabilityCollection.map(capabilityItem => getCapabilityIdentifier(capabilityItem)!);
      const capabilitiesToAdd = capabilities.filter(capabilityItem => {
        const capabilityIdentifier = getCapabilityIdentifier(capabilityItem);
        if (capabilityIdentifier == null || capabilityCollectionIdentifiers.includes(capabilityIdentifier)) {
          return false;
        }
        capabilityCollectionIdentifiers.push(capabilityIdentifier);
        return true;
      });
      return [...capabilitiesToAdd, ...capabilityCollection];
    }
    return capabilityCollection;
  }
}
