import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SLABlockDetailComponent } from './sla-block-detail.component';

describe('SLABlock Management Detail Component', () => {
  let comp: SLABlockDetailComponent;
  let fixture: ComponentFixture<SLABlockDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SLABlockDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sLABlock: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(SLABlockDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SLABlockDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sLABlock on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sLABlock).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
