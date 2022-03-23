import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISurvey } from '../survey.model';

@Component({
  selector: 'jhi-survey-detail',
  templateUrl: './survey-detail.component.html',
})
export class SurveyDetailComponent implements OnInit {
  survey: ISurvey | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ survey }) => {
      this.survey = survey;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
