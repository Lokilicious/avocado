import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SurveyComponent } from '../list/survey.component';
import { SurveyDetailComponent } from '../detail/survey-detail.component';
import { SurveyUpdateComponent } from '../update/survey-update.component';
import { SurveyRoutingResolveService } from './survey-routing-resolve.service';

const surveyRoute: Routes = [
  {
    path: '',
    component: SurveyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SurveyDetailComponent,
    resolve: {
      survey: SurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SurveyUpdateComponent,
    resolve: {
      survey: SurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SurveyUpdateComponent,
    resolve: {
      survey: SurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(surveyRoute)],
  exports: [RouterModule],
})
export class SurveyRoutingModule {}
