import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnswerDetailComponent } from './answer-detail.component';

describe('Answer Management Detail Component', () => {
  let comp: AnswerDetailComponent;
  let fixture: ComponentFixture<AnswerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ answer: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(AnswerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AnswerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load answer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.answer).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
