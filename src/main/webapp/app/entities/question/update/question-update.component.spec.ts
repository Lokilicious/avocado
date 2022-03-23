import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { QuestionService } from '../service/question.service';
import { IQuestion, Question } from '../question.model';
import { ISLABlock } from 'app/entities/sla-block/sla-block.model';
import { SLABlockService } from 'app/entities/sla-block/service/sla-block.service';

import { QuestionUpdateComponent } from './question-update.component';

describe('Question Management Update Component', () => {
  let comp: QuestionUpdateComponent;
  let fixture: ComponentFixture<QuestionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionService: QuestionService;
  let sLABlockService: SLABlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [QuestionUpdateComponent],
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
      .overrideTemplate(QuestionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionService = TestBed.inject(QuestionService);
    sLABlockService = TestBed.inject(SLABlockService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SLABlock query and add missing value', () => {
      const question: IQuestion = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const slaBlock: ISLABlock = { id: 'b0a15e0b-e428-4e99-9ef4-d5f8aa493078' };
      question.slaBlock = slaBlock;

      const sLABlockCollection: ISLABlock[] = [{ id: '5afa538d-dcd9-4532-963d-19824b3a639a' }];
      jest.spyOn(sLABlockService, 'query').mockReturnValue(of(new HttpResponse({ body: sLABlockCollection })));
      const additionalSLABlocks = [slaBlock];
      const expectedCollection: ISLABlock[] = [...additionalSLABlocks, ...sLABlockCollection];
      jest.spyOn(sLABlockService, 'addSLABlockToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ question });
      comp.ngOnInit();

      expect(sLABlockService.query).toHaveBeenCalled();
      expect(sLABlockService.addSLABlockToCollectionIfMissing).toHaveBeenCalledWith(sLABlockCollection, ...additionalSLABlocks);
      expect(comp.sLABlocksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const question: IQuestion = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const slaBlock: ISLABlock = { id: '9758446e-71c6-432f-9811-86c35e34c6ae' };
      question.slaBlock = slaBlock;

      activatedRoute.data = of({ question });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(question));
      expect(comp.sLABlocksSharedCollection).toContain(slaBlock);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Question>>();
      const question = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: question }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionService.update).toHaveBeenCalledWith(question);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Question>>();
      const question = new Question();
      jest.spyOn(questionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: question }));
      saveSubject.complete();

      // THEN
      expect(questionService.create).toHaveBeenCalledWith(question);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Question>>();
      const question = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionService.update).toHaveBeenCalledWith(question);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSLABlockById', () => {
      it('Should return tracked SLABlock primary key', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const trackResult = comp.trackSLABlockById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
