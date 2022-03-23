import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnswer, Answer } from '../answer.model';
import { AnswerService } from '../service/answer.service';

@Injectable({ providedIn: 'root' })
export class AnswerRoutingResolveService implements Resolve<IAnswer> {
  constructor(protected service: AnswerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnswer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((answer: HttpResponse<Answer>) => {
          if (answer.body) {
            return of(answer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Answer());
  }
}
