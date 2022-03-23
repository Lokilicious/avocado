import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AnswerService } from '../service/answer.service';

import { AnswerComponent } from './answer.component';

describe('Answer Management Component', () => {
  let comp: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let service: AnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AnswerComponent],
    })
      .overrideTemplate(AnswerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnswerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AnswerService);

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
    expect(comp.answers?.[0]).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
  });
});
