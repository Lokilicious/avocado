import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswer } from '../answer.model';
import { AnswerService } from '../service/answer.service';
import { AnswerDeleteDialogComponent } from '../delete/answer-delete-dialog.component';

@Component({
  selector: 'jhi-answer',
  templateUrl: './answer.component.html',
})
export class AnswerComponent implements OnInit {
  answers?: IAnswer[];
  isLoading = false;

  constructor(protected answerService: AnswerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.answerService.query().subscribe({
      next: (res: HttpResponse<IAnswer[]>) => {
        this.isLoading = false;
        this.answers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnswer): string {
    return item.id!;
  }

  delete(answer: IAnswer): void {
    const modalRef = this.modalService.open(AnswerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.answer = answer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
