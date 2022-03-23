import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISLABlock } from '../sla-block.model';

@Component({
  selector: 'jhi-sla-block-detail',
  templateUrl: './sla-block-detail.component.html',
})
export class SLABlockDetailComponent implements OnInit {
  sLABlock: ISLABlock | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sLABlock }) => {
      this.sLABlock = sLABlock;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
