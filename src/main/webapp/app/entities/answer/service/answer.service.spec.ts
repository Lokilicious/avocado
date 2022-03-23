import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnswer, Answer } from '../answer.model';

import { AnswerService } from './answer.service';

describe('Answer Service', () => {
  let service: AnswerService;
  let httpMock: HttpTestingController;
  let elemDefault: IAnswer;
  let expectedResult: IAnswer | IAnswer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AnswerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      numResponses: 0,
      resultNumeric: 0,
      resultString: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Answer', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Answer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Answer', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          numResponses: 1,
          resultNumeric: 1,
          resultString: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Answer', () => {
      const patchObject = Object.assign(
        {
          numResponses: 1,
          resultNumeric: 1,
        },
        new Answer()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Answer', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          numResponses: 1,
          resultNumeric: 1,
          resultString: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Answer', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAnswerToCollectionIfMissing', () => {
      it('should add a Answer to an empty array', () => {
        const answer: IAnswer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addAnswerToCollectionIfMissing([], answer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(answer);
      });

      it('should not add a Answer to an array that contains it', () => {
        const answer: IAnswer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const answerCollection: IAnswer[] = [
          {
            ...answer,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addAnswerToCollectionIfMissing(answerCollection, answer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Answer to an array that doesn't contain it", () => {
        const answer: IAnswer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const answerCollection: IAnswer[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addAnswerToCollectionIfMissing(answerCollection, answer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(answer);
      });

      it('should add only unique Answer to an array', () => {
        const answerArray: IAnswer[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: 'e5e56d41-c1d6-4fef-9c63-2b87b288f9c5' },
        ];
        const answerCollection: IAnswer[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addAnswerToCollectionIfMissing(answerCollection, ...answerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const answer: IAnswer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const answer2: IAnswer = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addAnswerToCollectionIfMissing([], answer, answer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(answer);
        expect(expectedResult).toContain(answer2);
      });

      it('should accept null and undefined values', () => {
        const answer: IAnswer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addAnswerToCollectionIfMissing([], null, answer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(answer);
      });

      it('should return initial array if no Answer is added', () => {
        const answerCollection: IAnswer[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addAnswerToCollectionIfMissing(answerCollection, undefined, null);
        expect(expectedResult).toEqual(answerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
