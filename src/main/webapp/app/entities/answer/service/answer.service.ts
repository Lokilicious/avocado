import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnswer, getAnswerIdentifier } from '../answer.model';

export type EntityResponseType = HttpResponse<IAnswer>;
export type EntityArrayResponseType = HttpResponse<IAnswer[]>;

@Injectable({ providedIn: 'root' })
export class AnswerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/answers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(answer: IAnswer): Observable<EntityResponseType> {
    return this.http.post<IAnswer>(this.resourceUrl, answer, { observe: 'response' });
  }

  update(answer: IAnswer): Observable<EntityResponseType> {
    return this.http.put<IAnswer>(`${this.resourceUrl}/${getAnswerIdentifier(answer) as string}`, answer, { observe: 'response' });
  }

  partialUpdate(answer: IAnswer): Observable<EntityResponseType> {
    return this.http.patch<IAnswer>(`${this.resourceUrl}/${getAnswerIdentifier(answer) as string}`, answer, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAnswer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnswer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnswerToCollectionIfMissing(answerCollection: IAnswer[], ...answersToCheck: (IAnswer | null | undefined)[]): IAnswer[] {
    const answers: IAnswer[] = answersToCheck.filter(isPresent);
    if (answers.length > 0) {
      const answerCollectionIdentifiers = answerCollection.map(answerItem => getAnswerIdentifier(answerItem)!);
      const answersToAdd = answers.filter(answerItem => {
        const answerIdentifier = getAnswerIdentifier(answerItem);
        if (answerIdentifier == null || answerCollectionIdentifiers.includes(answerIdentifier)) {
          return false;
        }
        answerCollectionIdentifiers.push(answerIdentifier);
        return true;
      });
      return [...answersToAdd, ...answerCollection];
    }
    return answerCollection;
  }
}
