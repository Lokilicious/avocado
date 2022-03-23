import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISurvey, Survey } from '../survey.model';
import { SurveyService } from '../service/survey.service';

@Injectable({ providedIn: 'root' })
export class SurveyRoutingResolveService implements Resolve<ISurvey> {
  constructor(protected service: SurveyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISurvey> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((survey: HttpResponse<Survey>) => {
          if (survey.body) {
            return of(survey.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Survey());
  }
}
