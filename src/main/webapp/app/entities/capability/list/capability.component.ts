import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICapability } from '../capability.model';
import { CapabilityService } from '../service/capability.service';
import { CapabilityDeleteDialogComponent } from '../delete/capability-delete-dialog.component';

@Component({
  selector: 'jhi-capability',
  templateUrl: './capability.component.html',
})
export class CapabilityComponent implements OnInit {
  capabilities?: ICapability[];
  isLoading = false;

  constructor(protected capabilityService: CapabilityService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.capabilityService.query().subscribe({
      next: (res: HttpResponse<ICapability[]>) => {
        this.isLoading = false;
        this.capabilities = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICapability): string {
    return item.id!;
  }

  delete(capability: ICapability): void {
    const modalRef = this.modalService.open(CapabilityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.capability = capability;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
