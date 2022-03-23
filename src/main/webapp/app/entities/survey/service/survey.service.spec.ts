import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISurvey, Survey } from '../survey.model';

import { SurveyService } from './survey.service';

describe('Survey Service', () => {
  let service: SurveyService;
  let httpMock: HttpTestingController;
  let elemDefault: ISurvey;
  let expectedResult: ISurvey | ISurvey[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SurveyService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      surveyDate: currentDate,
      createdDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          surveyDate: currentDate.format(DATE_TIME_FORMAT),
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Survey', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          surveyDate: currentDate.format(DATE_TIME_FORMAT),
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          surveyDate: currentDate,
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Survey()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Survey', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          surveyDate: currentDate.format(DATE_TIME_FORMAT),
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          surveyDate: currentDate,
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Survey', () => {
      const patchObject = Object.assign(
        {
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Survey()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          surveyDate: currentDate,
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Survey', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          surveyDate: currentDate.format(DATE_TIME_FORMAT),
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          surveyDate: currentDate,
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Survey', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSurveyToCollectionIfMissing', () => {
      it('should add a Survey to an empty array', () => {
        const survey: ISurvey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addSurveyToCollectionIfMissing([], survey);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(survey);
      });

      it('should not add a Survey to an array that contains it', () => {
        const survey: ISurvey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const surveyCollection: ISurvey[] = [
          {
            ...survey,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, survey);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Survey to an array that doesn't contain it", () => {
        const survey: ISurvey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const surveyCollection: ISurvey[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, survey);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(survey);
      });

      it('should add only unique Survey to an array', () => {
        const surveyArray: ISurvey[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: 'b411a3dd-cd4d-4a5c-a65c-7b6acbdd1d8c' },
        ];
        const surveyCollection: ISurvey[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, ...surveyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const survey: ISurvey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const survey2: ISurvey = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addSurveyToCollectionIfMissing([], survey, survey2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(survey);
        expect(expectedResult).toContain(survey2);
      });

      it('should accept null and undefined values', () => {
        const survey: ISurvey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addSurveyToCollectionIfMissing([], null, survey, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(survey);
      });

      it('should return initial array if no Survey is added', () => {
        const surveyCollection: ISurvey[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, undefined, null);
        expect(expectedResult).toEqual(surveyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
