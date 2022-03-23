import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISLABlock, SLABlock } from '../sla-block.model';
import { SLABlockService } from '../service/sla-block.service';

@Component({
  selector: 'jhi-sla-block-update',
  templateUrl: './sla-block-update.component.html',
})
export class SLABlockUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected sLABlockService: SLABlockService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sLABlock }) => {
      this.updateForm(sLABlock);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sLABlock = this.createFromForm();
    if (sLABlock.id !== undefined) {
      this.subscribeToSaveResponse(this.sLABlockService.update(sLABlock));
    } else {
      this.subscribeToSaveResponse(this.sLABlockService.create(sLABlock));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISLABlock>>): void {
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

  protected updateForm(sLABlock: ISLABlock): void {
    this.editForm.patchValue({
      id: sLABlock.id,
      name: sLABlock.name,
    });
  }

  protected createFromForm(): ISLABlock {
    return {
      ...new SLABlock(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
