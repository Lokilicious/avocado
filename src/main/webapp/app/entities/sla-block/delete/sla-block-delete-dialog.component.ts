import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISLABlock } from '../sla-block.model';
import { SLABlockService } from '../service/sla-block.service';

@Component({
  templateUrl: './sla-block-delete-dialog.component.html',
})
export class SLABlockDeleteDialogComponent {
  sLABlock?: ISLABlock;

  constructor(protected sLABlockService: SLABlockService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.sLABlockService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
