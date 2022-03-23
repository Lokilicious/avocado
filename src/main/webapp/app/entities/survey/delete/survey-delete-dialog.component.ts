import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISurvey } from '../survey.model';
import { SurveyService } from '../service/survey.service';

@Component({
  templateUrl: './survey-delete-dialog.component.html',
})
export class SurveyDeleteDialogComponent {
  survey?: ISurvey;

  constructor(protected surveyService: SurveyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.surveyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
