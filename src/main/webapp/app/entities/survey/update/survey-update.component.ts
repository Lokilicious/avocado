import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISurvey, Survey } from '../survey.model';
import { SurveyService } from '../service/survey.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

@Component({
  selector: 'jhi-survey-update',
  templateUrl: './survey-update.component.html',
})
export class SurveyUpdateComponent implements OnInit {
  isSaving = false;

  teamsSharedCollection: ITeam[] = [];

  editForm = this.fb.group({
    id: [],
    surveyDate: [],
    createdDate: [],
    team: [],
  });

  constructor(
    protected surveyService: SurveyService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ survey }) => {
      if (survey.id === undefined) {
        const today = dayjs().startOf('day');
        survey.surveyDate = today;
        survey.createdDate = today;
      }

      this.updateForm(survey);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const survey = this.createFromForm();
    if (survey.id !== undefined) {
      this.subscribeToSaveResponse(this.surveyService.update(survey));
    } else {
      this.subscribeToSaveResponse(this.surveyService.create(survey));
    }
  }

  trackTeamById(index: number, item: ITeam): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISurvey>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(survey: ISurvey): void {
    this.editForm.patchValue({
      id: survey.id,
      surveyDate: survey.surveyDate ? survey.surveyDate.format(DATE_TIME_FORMAT) : null,
      createdDate: survey.createdDate ? survey.createdDate.format(DATE_TIME_FORMAT) : null,
      team: survey.team,
    });

    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing(this.teamsSharedCollection, survey.team);
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing(teams, this.editForm.get('team')!.value)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): ISurvey {
    return {
      ...new Survey(),
      id: this.editForm.get(['id'])!.value,
      surveyDate: this.editForm.get(['surveyDate'])!.value ? dayjs(this.editForm.get(['surveyDate'])!.value, DATE_TIME_FORMAT) : undefined,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      team: this.editForm.get(['team'])!.value,
    };
  }
}
