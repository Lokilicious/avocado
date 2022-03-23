import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AnswerComponent } from './list/answer.component';
import { AnswerDetailComponent } from './detail/answer-detail.component';
import { AnswerUpdateComponent } from './update/answer-update.component';
import { AnswerDeleteDialogComponent } from './delete/answer-delete-dialog.component';
import { AnswerRoutingModule } from './route/answer-routing.module';

@NgModule({
  imports: [SharedModule, AnswerRoutingModule],
  declarations: [AnswerComponent, AnswerDetailComponent, AnswerUpdateComponent, AnswerDeleteDialogComponent],
  entryComponents: [AnswerDeleteDialogComponent],
})
export class AnswerModule {}
