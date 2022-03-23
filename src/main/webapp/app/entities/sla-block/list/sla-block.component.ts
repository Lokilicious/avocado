import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISLABlock } from '../sla-block.model';
import { SLABlockService } from '../service/sla-block.service';
import { SLABlockDeleteDialogComponent } from '../delete/sla-block-delete-dialog.component';

@Component({
  selector: 'jhi-sla-block',
  templateUrl: './sla-block.component.html',
})
export class SLABlockComponent implements OnInit {
  sLABlocks?: ISLABlock[];
  isLoading = false;

  constructor(protected sLABlockService: SLABlockService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sLABlockService.query().subscribe({
      next: (res: HttpResponse<ISLABlock[]>) => {
        this.isLoading = false;
        this.sLABlocks = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISLABlock): string {
    return item.id!;
  }

  delete(sLABlock: ISLABlock): void {
    const modalRef = this.modalService.open(SLABlockDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sLABlock = sLABlock;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
