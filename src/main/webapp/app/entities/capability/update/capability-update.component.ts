import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICapability, Capability } from '../capability.model';
import { CapabilityService } from '../service/capability.service';

@Component({
  selector: 'jhi-capability-update',
  templateUrl: './capability-update.component.html',
})
export class CapabilityUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected capabilityService: CapabilityService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ capability }) => {
      this.updateForm(capability);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const capability = this.createFromForm();
    if (capability.id !== undefined) {
      this.subscribeToSaveResponse(this.capabilityService.update(capability));
    } else {
      this.subscribeToSaveResponse(this.capabilityService.create(capability));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICapability>>): void {
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

  protected updateForm(capability: ICapability): void {
    this.editForm.patchValue({
      id: capability.id,
      name: capability.name,
    });
  }

  protected createFromForm(): ICapability {
    return {
      ...new Capability(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
