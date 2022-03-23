import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TeamService } from '../service/team.service';
import { ITeam, Team } from '../team.model';
import { ICapability } from 'app/entities/capability/capability.model';
import { CapabilityService } from 'app/entities/capability/service/capability.service';

import { TeamUpdateComponent } from './team-update.component';

describe('Team Management Update Component', () => {
  let comp: TeamUpdateComponent;
  let fixture: ComponentFixture<TeamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let teamService: TeamService;
  let capabilityService: CapabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TeamUpdateComponent],
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
      .overrideTemplate(TeamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TeamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    teamService = TestBed.inject(TeamService);
    capabilityService = TestBed.inject(CapabilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Capability query and add missing value', () => {
      const team: ITeam = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const capability: ICapability = { id: 'd95fd54e-d68b-4a97-b45e-b13c1fc5a858' };
      team.capability = capability;

      const capabilityCollection: ICapability[] = [{ id: '045436a8-1558-4a9c-bbb3-5f0d80ce04c3' }];
      jest.spyOn(capabilityService, 'query').mockReturnValue(of(new HttpResponse({ body: capabilityCollection })));
      const additionalCapabilities = [capability];
      const expectedCollection: ICapability[] = [...additionalCapabilities, ...capabilityCollection];
      jest.spyOn(capabilityService, 'addCapabilityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ team });
      comp.ngOnInit();

      expect(capabilityService.query).toHaveBeenCalled();
      expect(capabilityService.addCapabilityToCollectionIfMissing).toHaveBeenCalledWith(capabilityCollection, ...additionalCapabilities);
      expect(comp.capabilitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const team: ITeam = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const capability: ICapability = { id: '4a986805-de21-4b9c-8237-dfda78127e3b' };
      team.capability = capability;

      activatedRoute.data = of({ team });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(team));
      expect(comp.capabilitiesSharedCollection).toContain(capability);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Team>>();
      const team = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(teamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ team });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: team }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(teamService.update).toHaveBeenCalledWith(team);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Team>>();
      const team = new Team();
      jest.spyOn(teamService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ team });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: team }));
      saveSubject.complete();

      // THEN
      expect(teamService.create).toHaveBeenCalledWith(team);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Team>>();
      const team = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(teamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ team });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(teamService.update).toHaveBeenCalledWith(team);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCapabilityById', () => {
      it('Should return tracked Capability primary key', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const trackResult = comp.trackCapabilityById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
