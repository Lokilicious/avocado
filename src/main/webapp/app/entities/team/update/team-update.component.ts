import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITeam, Team } from '../team.model';
import { TeamService } from '../service/team.service';
import { ICapability } from 'app/entities/capability/capability.model';
import { CapabilityService } from 'app/entities/capability/service/capability.service';

@Component({
  selector: 'jhi-team-update',
  templateUrl: './team-update.component.html',
})
export class TeamUpdateComponent implements OnInit {
  isSaving = false;

  capabilitiesSharedCollection: ICapability[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    advocate: [],
    coach: [],
    currentlyCoached: [],
    numMembers: [],
    createdDate: [],
    capability: [],
  });

  constructor(
    protected teamService: TeamService,
    protected capabilityService: CapabilityService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      if (team.id === undefined) {
        const today = dayjs().startOf('day');
        team.createdDate = today;
      }

      this.updateForm(team);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const team = this.createFromForm();
    if (team.id !== undefined) {
      this.subscribeToSaveResponse(this.teamService.update(team));
    } else {
      this.subscribeToSaveResponse(this.teamService.create(team));
    }
  }

  trackCapabilityById(index: number, item: ICapability): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeam>>): void {
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

  protected updateForm(team: ITeam): void {
    this.editForm.patchValue({
      id: team.id,
      name: team.name,
      advocate: team.advocate,
      coach: team.coach,
      currentlyCoached: team.currentlyCoached,
      numMembers: team.numMembers,
      createdDate: team.createdDate ? team.createdDate.format(DATE_TIME_FORMAT) : null,
      capability: team.capability,
    });

    this.capabilitiesSharedCollection = this.capabilityService.addCapabilityToCollectionIfMissing(
      this.capabilitiesSharedCollection,
      team.capability
    );
  }

  protected loadRelationshipsOptions(): void {
    this.capabilityService
      .query()
      .pipe(map((res: HttpResponse<ICapability[]>) => res.body ?? []))
      .pipe(
        map((capabilities: ICapability[]) =>
          this.capabilityService.addCapabilityToCollectionIfMissing(capabilities, this.editForm.get('capability')!.value)
        )
      )
      .subscribe((capabilities: ICapability[]) => (this.capabilitiesSharedCollection = capabilities));
  }

  protected createFromForm(): ITeam {
    return {
      ...new Team(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      advocate: this.editForm.get(['advocate'])!.value,
      coach: this.editForm.get(['coach'])!.value,
      currentlyCoached: this.editForm.get(['currentlyCoached'])!.value,
      numMembers: this.editForm.get(['numMembers'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      capability: this.editForm.get(['capability'])!.value,
    };
  }
}
