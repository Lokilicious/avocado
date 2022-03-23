import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';
import { ISLABlock } from 'app/entities/sla-block/sla-block.model';
import { SLABlockService } from 'app/entities/sla-block/service/sla-block.service';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;

  sLABlocksSharedCollection: ISLABlock[] = [];

  editForm = this.fb.group({
    id: [],
    text: [],
    slaBlock: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected sLABlockService: SLABlockService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.updateForm(question);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  trackSLABlockById(index: number, item: ISLABlock): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
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

  protected updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      id: question.id,
      text: question.text,
      slaBlock: question.slaBlock,
    });

    this.sLABlocksSharedCollection = this.sLABlockService.addSLABlockToCollectionIfMissing(
      this.sLABlocksSharedCollection,
      question.slaBlock
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sLABlockService
      .query()
      .pipe(map((res: HttpResponse<ISLABlock[]>) => res.body ?? []))
      .pipe(
        map((sLABlocks: ISLABlock[]) =>
          this.sLABlockService.addSLABlockToCollectionIfMissing(sLABlocks, this.editForm.get('slaBlock')!.value)
        )
      )
      .subscribe((sLABlocks: ISLABlock[]) => (this.sLABlocksSharedCollection = sLABlocks));
  }

  protected createFromForm(): IQuestion {
    return {
      ...new Question(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      slaBlock: this.editForm.get(['slaBlock'])!.value,
    };
  }
}
