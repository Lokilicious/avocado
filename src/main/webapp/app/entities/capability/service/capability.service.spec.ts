import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICapability, Capability } from '../capability.model';

import { CapabilityService } from './capability.service';

describe('Capability Service', () => {
  let service: CapabilityService;
  let httpMock: HttpTestingController;
  let elemDefault: ICapability;
  let expectedResult: ICapability | ICapability[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CapabilityService);
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

    it('should create a Capability', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Capability()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Capability', () => {
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

    it('should partial update a Capability', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Capability()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Capability', () => {
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

    it('should delete a Capability', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCapabilityToCollectionIfMissing', () => {
      it('should add a Capability to an empty array', () => {
        const capability: ICapability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addCapabilityToCollectionIfMissing([], capability);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(capability);
      });

      it('should not add a Capability to an array that contains it', () => {
        const capability: ICapability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const capabilityCollection: ICapability[] = [
          {
            ...capability,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addCapabilityToCollectionIfMissing(capabilityCollection, capability);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Capability to an array that doesn't contain it", () => {
        const capability: ICapability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const capabilityCollection: ICapability[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addCapabilityToCollectionIfMissing(capabilityCollection, capability);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(capability);
      });

      it('should add only unique Capability to an array', () => {
        const capabilityArray: ICapability[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: '42e18871-aae8-488e-8017-64818ee24004' },
        ];
        const capabilityCollection: ICapability[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addCapabilityToCollectionIfMissing(capabilityCollection, ...capabilityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const capability: ICapability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const capability2: ICapability = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addCapabilityToCollectionIfMissing([], capability, capability2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(capability);
        expect(expectedResult).toContain(capability2);
      });

      it('should accept null and undefined values', () => {
        const capability: ICapability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addCapabilityToCollectionIfMissing([], null, capability, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(capability);
      });

      it('should return initial array if no Capability is added', () => {
        const capabilityCollection: ICapability[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addCapabilityToCollectionIfMissing(capabilityCollection, undefined, null);
        expect(expectedResult).toEqual(capabilityCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
