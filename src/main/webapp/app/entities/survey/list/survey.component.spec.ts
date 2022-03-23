import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SurveyService } from '../service/survey.service';

import { SurveyComponent } from './survey.component';

describe('Survey Management Component', () => {
  let comp: SurveyComponent;
  let fixture: ComponentFixture<SurveyComponent>;
  let service: SurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SurveyComponent],
    })
      .overrideTemplate(SurveyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SurveyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SurveyService);

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
    expect(comp.surveys?.[0]).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
  });
});
