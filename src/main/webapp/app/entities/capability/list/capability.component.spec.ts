import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CapabilityService } from '../service/capability.service';

import { CapabilityComponent } from './capability.component';

describe('Capability Management Component', () => {
  let comp: CapabilityComponent;
  let fixture: ComponentFixture<CapabilityComponent>;
  let service: CapabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CapabilityComponent],
    })
      .overrideTemplate(CapabilityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CapabilityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CapabilityService);

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
    expect(comp.capabilities?.[0]).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
  });
});
