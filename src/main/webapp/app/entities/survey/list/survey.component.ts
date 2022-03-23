import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISurvey } from '../survey.model';
import { SurveyService } from '../service/survey.service';
import { SurveyDeleteDialogComponent } from '../delete/survey-delete-dialog.component';

@Component({
  selector: 'jhi-survey',
  templateUrl: './survey.component.html',
})
export class SurveyComponent implements OnInit {
  surveys?: ISurvey[];
  isLoading = false;

  constructor(protected surveyService: SurveyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.surveyService.query().subscribe({
      next: (res: HttpResponse<ISurvey[]>) => {
        this.isLoading = false;
        this.surveys = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISurvey): string {
    return item.id!;
  }

  delete(survey: ISurvey): void {
    const modalRef = this.modalService.open(SurveyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.survey = survey;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
