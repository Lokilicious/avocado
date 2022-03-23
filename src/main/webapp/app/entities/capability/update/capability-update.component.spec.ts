import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CapabilityService } from '../service/capability.service';
import { ICapability, Capability } from '../capability.model';

import { CapabilityUpdateComponent } from './capability-update.component';

describe('Capability Management Update Component', () => {
  let comp: CapabilityUpdateComponent;
  let fixture: ComponentFixture<CapabilityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let capabilityService: CapabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CapabilityUpdateComponent],
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
      .overrideTemplate(CapabilityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CapabilityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    capabilityService = TestBed.inject(CapabilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const capability: ICapability = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ capability });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(capability));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Capability>>();
      const capability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(capabilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ capability });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: capability }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(capabilityService.update).toHaveBeenCalledWith(capability);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Capability>>();
      const capability = new Capability();
      jest.spyOn(capabilityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ capability });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: capability }));
      saveSubject.complete();

      // THEN
      expect(capabilityService.create).toHaveBeenCalledWith(capability);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Capability>>();
      const capability = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(capabilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ capability });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(capabilityService.update).toHaveBeenCalledWith(capability);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
