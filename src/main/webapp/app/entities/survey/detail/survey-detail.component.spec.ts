import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SurveyDetailComponent } from './survey-detail.component';

describe('Survey Management Detail Component', () => {
  let comp: SurveyDetailComponent;
  let fixture: ComponentFixture<SurveyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ survey: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(SurveyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SurveyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load survey on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.survey).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
