import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SurveyService } from '../service/survey.service';
import { ISurvey, Survey } from '../survey.model';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

import { SurveyUpdateComponent } from './survey-update.component';

describe('Survey Management Update Component', () => {
  let comp: SurveyUpdateComponent;
  let fixture: ComponentFixture<SurveyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let surveyService: SurveyService;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SurveyUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SurveyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SurveyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    surveyService = TestBed.inject(SurveyService);
    teamService = TestBed.inject(TeamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Team query and add missing value', () => {
      const survey: ISurvey = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const team: ITeam = { id: '3debfc0b-30c4-41bf-85d3-4eba5f1586bc' };
      survey.team = team;

      const teamCollection: ITeam[] = [{ id: '31d1c0a9-e2cd-4fa6-a5dd-bc7c524e1bd8' }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [team];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(teamCollection, ...additionalTeams);
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const survey: ISurvey = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const team: ITeam = { id: '19de16d3-2072-4a68-9d18-428b2deceaeb' };
      survey.team = team;

      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(survey));
      expect(comp.teamsSharedCollection).toContain(team);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Survey>>();
      const survey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(surveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: survey }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(surveyService.update).toHaveBeenCalledWith(survey);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Survey>>();
      const survey = new Survey();
      jest.spyOn(surveyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: survey }));
      saveSubject.complete();

      // THEN
      expect(surveyService.create).toHaveBeenCalledWith(survey);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Survey>>();
      const survey = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(surveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(surveyService.update).toHaveBeenCalledWith(survey);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTeamById', () => {
      it('Should return tracked Team primary key', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const trackResult = comp.trackTeamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
