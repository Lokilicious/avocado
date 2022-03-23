import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SLABlockService } from '../service/sla-block.service';

import { SLABlockComponent } from './sla-block.component';

describe('SLABlock Management Component', () => {
  let comp: SLABlockComponent;
  let fixture: ComponentFixture<SLABlockComponent>;
  let service: SLABlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SLABlockComponent],
    })
      .overrideTemplate(SLABlockComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SLABlockComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SLABlockService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.sLABlocks?.[0]).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
  });
});
