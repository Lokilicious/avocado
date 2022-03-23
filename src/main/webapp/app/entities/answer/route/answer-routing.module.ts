import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnswerComponent } from '../list/answer.component';
import { AnswerDetailComponent } from '../detail/answer-detail.component';
import { AnswerUpdateComponent } from '../update/answer-update.component';
import { AnswerRoutingResolveService } from './answer-routing-resolve.service';

const answerRoute: Routes = [
  {
    path: '',
    component: AnswerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnswerDetailComponent,
    resolve: {
      answer: AnswerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnswerUpdateComponent,
    resolve: {
      answer: AnswerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnswerUpdateComponent,
    resolve: {
      answer: AnswerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(answerRoute)],
  exports: [RouterModule],
})
export class AnswerRoutingModule {}
