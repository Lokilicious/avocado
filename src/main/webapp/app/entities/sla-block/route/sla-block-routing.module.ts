import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SLABlockComponent } from '../list/sla-block.component';
import { SLABlockDetailComponent } from '../detail/sla-block-detail.component';
import { SLABlockUpdateComponent } from '../update/sla-block-update.component';
import { SLABlockRoutingResolveService } from './sla-block-routing-resolve.service';

const sLABlockRoute: Routes = [
  {
    path: '',
    component: SLABlockComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SLABlockDetailComponent,
    resolve: {
      sLABlock: SLABlockRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SLABlockUpdateComponent,
    resolve: {
      sLABlock: SLABlockRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SLABlockUpdateComponent,
    resolve: {
      sLABlock: SLABlockRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sLABlockRoute)],
  exports: [RouterModule],
})
export class SLABlockRoutingModule {}
