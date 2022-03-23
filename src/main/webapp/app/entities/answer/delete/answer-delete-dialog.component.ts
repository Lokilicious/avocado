import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswer } from '../answer.model';
import { AnswerService } from '../service/answer.service';

@Component({
  templateUrl: './answer-delete-dialog.component.html',
})
export class AnswerDeleteDialogComponent {
  answer?: IAnswer;

  constructor(protected answerService: AnswerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.answerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
