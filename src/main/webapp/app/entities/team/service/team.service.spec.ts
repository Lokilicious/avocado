import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITeam, Team } from '../team.model';

import { TeamService } from './team.service';

describe('Team Service', () => {
  let service: TeamService;
  let httpMock: HttpTestingController;
  let elemDefault: ITeam;
  let expectedResult: ITeam | ITeam[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TeamService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      advocate: 'AAAAAAA',
      coach: 'AAAAAAA',
      currentlyCoached: false,
      numMembers: 0,
      createdDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Team', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Team()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Team', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          advocate: 'BBBBBB',
          coach: 'BBBBBB',
          currentlyCoached: true,
          numMembers: 1,
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Team', () => {
      const patchObject = Object.assign(
        {
          currentlyCoached: true,
          numMembers: 1,
        },
        new Team()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Team', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          advocate: 'BBBBBB',
          coach: 'BBBBBB',
          currentlyCoached: true,
          numMembers: 1,
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
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

    it('should delete a Team', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTeamToCollectionIfMissing', () => {
      it('should add a Team to an empty array', () => {
        const team: ITeam = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addTeamToCollectionIfMissing([], team);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(team);
      });

      it('should not add a Team to an array that contains it', () => {
        const team: ITeam = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const teamCollection: ITeam[] = [
          {
            ...team,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addTeamToCollectionIfMissing(teamCollection, team);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Team to an array that doesn't contain it", () => {
        const team: ITeam = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const teamCollection: ITeam[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addTeamToCollectionIfMissing(teamCollection, team);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(team);
      });

      it('should add only unique Team to an array', () => {
        const teamArray: ITeam[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: 'cc4d1559-53c6-48dd-8f59-bb9f51a5472c' },
        ];
        const teamCollection: ITeam[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addTeamToCollectionIfMissing(teamCollection, ...teamArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const team: ITeam = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const team2: ITeam = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addTeamToCollectionIfMissing([], team, team2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(team);
        expect(expectedResult).toContain(team2);
      });

      it('should accept null and undefined values', () => {
        const team: ITeam = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addTeamToCollectionIfMissing([], null, team, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(team);
      });

      it('should return initial array if no Team is added', () => {
        const teamCollection: ITeam[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addTeamToCollectionIfMissing(teamCollection, undefined, null);
        expect(expectedResult).toEqual(teamCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
