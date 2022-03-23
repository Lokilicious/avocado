import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SLABlockService } from '../service/sla-block.service';
import { ISLABlock, SLABlock } from '../sla-block.model';

import { SLABlockUpdateComponent } from './sla-block-update.component';

describe('SLABlock Management Update Component', () => {
  let comp: SLABlockUpdateComponent;
  let fixture: ComponentFixture<SLABlockUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sLABlockService: SLABlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SLABlockUpdateComponent],
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
      .overrideTemplate(SLABlockUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SLABlockUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sLABlockService = TestBed.inject(SLABlockService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sLABlock: ISLABlock = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ sLABlock });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sLABlock));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SLABlock>>();
      const sLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(sLABlockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sLABlock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sLABlock }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sLABlockService.update).toHaveBeenCalledWith(sLABlock);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SLABlock>>();
      const sLABlock = new SLABlock();
      jest.spyOn(sLABlockService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sLABlock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sLABlock }));
      saveSubject.complete();

      // THEN
      expect(sLABlockService.create).toHaveBeenCalledWith(sLABlock);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SLABlock>>();
      const sLABlock = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(sLABlockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sLABlock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sLABlockService.update).toHaveBeenCalledWith(sLABlock);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
