import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SLABlockComponent } from './list/sla-block.component';
import { SLABlockDetailComponent } from './detail/sla-block-detail.component';
import { SLABlockUpdateComponent } from './update/sla-block-update.component';
import { SLABlockDeleteDialogComponent } from './delete/sla-block-delete-dialog.component';
import { SLABlockRoutingModule } from './route/sla-block-routing.module';

@NgModule({
  imports: [SharedModule, SLABlockRoutingModule],
  declarations: [SLABlockComponent, SLABlockDetailComponent, SLABlockUpdateComponent, SLABlockDeleteDialogComponent],
  entryComponents: [SLABlockDeleteDialogComponent],
})
export class SLABlockModule {}
