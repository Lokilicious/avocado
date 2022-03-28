import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAnswer, Answer } from '../answer.model';
import { AnswerService } from '../service/answer.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

@Component({
  selector: 'jhi-answer-update',
  templateUrl: './answer-update.component.html',
})
export class AnswerUpdateComponent implements OnInit {
  isSaving = false;

  questionsSharedCollection: IQuestion[] = [];
  surveysSharedCollection: ISurvey[] = [];

  editForm = this.fb.group({
    id: [],
    numResponses: [],
    resultNumeric: [],
    resultString: [],
    order: [],
    question: [],
    survey: [],
  });

  constructor(
    protected answerService: AnswerService,
    protected questionService: QuestionService,
    protected surveyService: SurveyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answer }) => {
      this.updateForm(answer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const answer = this.createFromForm();
    if (answer.id !== undefined) {
      this.subscribeToSaveResponse(this.answerService.update(answer));
    } else {
      this.subscribeToSaveResponse(this.answerService.create(answer));
    }
  }

  trackQuestionById(index: number, item: IQuestion): string {
    return item.id!;
  }

  trackSurveyById(index: number, item: ISurvey): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnswer>>): void {
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

  protected updateForm(answer: IAnswer): void {
    this.editForm.patchValue({
      id: answer.id,
      numResponses: answer.numResponses,
      resultNumeric: answer.resultNumeric,
      resultString: answer.resultString,
      order: answer.order,
      question: answer.question,
      survey: answer.survey,
    });

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing(this.questionsSharedCollection, answer.question);
    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, answer.survey);
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing(questions, this.editForm.get('question')!.value)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));

    this.surveyService
      .query()
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysSharedCollection = surveys));
  }

  protected createFromForm(): IAnswer {
    return {
      ...new Answer(),
      id: this.editForm.get(['id'])!.value,
      numResponses: this.editForm.get(['numResponses'])!.value,
      resultNumeric: this.editForm.get(['resultNumeric'])!.value,
      resultString: this.editForm.get(['resultString'])!.value,
      order: this.editForm.get(['order'])!.value,
      question: this.editForm.get(['question'])!.value,
      survey: this.editForm.get(['survey'])!.value,
    };
  }
}
