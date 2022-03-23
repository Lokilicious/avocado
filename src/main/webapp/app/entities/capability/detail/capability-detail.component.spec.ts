import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CapabilityDetailComponent } from './capability-detail.component';

describe('Capability Management Detail Component', () => {
  let comp: CapabilityDetailComponent;
  let fixture: ComponentFixture<CapabilityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CapabilityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ capability: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(CapabilityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CapabilityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load capability on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.capability).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
