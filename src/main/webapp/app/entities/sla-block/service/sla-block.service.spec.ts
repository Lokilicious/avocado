import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISLABlock, SLABlock } from '../sla-block.model';

import { SLABlockService } from './sla-block.service';

describe('SLABlock Service', () => {
  let service: SLABlockService;
  let httpMock: HttpTestingController;
  let elemDefault: ISLABlock;
  let expectedResult: ISLABlock | ISLABlock[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SLABlockService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
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

    it('should create a SLABlock', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SLABlock()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SLABlock', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SLABlock', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new SLABlock()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SLABlock', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
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

    it('should delete a SLABlock', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSLABlockToCollectionIfMissing', () => {
      it('should add a SLABlock to an empty array', () => {
        const sLABlock: ISLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addSLABlockToCollectionIfMissing([], sLABlock);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sLABlock);
      });

      it('should not add a SLABlock to an array that contains it', () => {
        const sLABlock: ISLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const sLABlockCollection: ISLABlock[] = [
          {
            ...sLABlock,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addSLABlockToCollectionIfMissing(sLABlockCollection, sLABlock);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SLABlock to an array that doesn't contain it", () => {
        const sLABlock: ISLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const sLABlockCollection: ISLABlock[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addSLABlockToCollectionIfMissing(sLABlockCollection, sLABlock);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sLABlock);
      });

      it('should add only unique SLABlock to an array', () => {
        const sLABlockArray: ISLABlock[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: '94eb51eb-3000-46e8-b781-659b6287ad87' },
        ];
        const sLABlockCollection: ISLABlock[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addSLABlockToCollectionIfMissing(sLABlockCollection, ...sLABlockArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sLABlock: ISLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const sLABlock2: ISLABlock = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addSLABlockToCollectionIfMissing([], sLABlock, sLABlock2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sLABlock);
        expect(expectedResult).toContain(sLABlock2);
      });

      it('should accept null and undefined values', () => {
        const sLABlock: ISLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addSLABlockToCollectionIfMissing([], null, sLABlock, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sLABlock);
      });

      it('should return initial array if no SLABlock is added', () => {
        const sLABlockCollection: ISLABlock[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addSLABlockToCollectionIfMissing(sLABlockCollection, undefined, null);
        expect(expectedResult).toEqual(sLABlockCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
