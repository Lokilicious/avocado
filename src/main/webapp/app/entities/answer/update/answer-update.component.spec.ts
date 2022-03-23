import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AnswerService } from '../service/answer.service';
import { IAnswer, Answer } from '../answer.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

import { AnswerUpdateComponent } from './answer-update.component';

describe('Answer Management Update Component', () => {
  let comp: AnswerUpdateComponent;
  let fixture: ComponentFixture<AnswerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let answerService: AnswerService;
  let questionService: QuestionService;
  let surveyService: SurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AnswerUpdateComponent],
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
      .overrideTemplate(AnswerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnswerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    answerService = TestBed.inject(AnswerService);
    questionService = TestBed.inject(QuestionService);
    surveyService = TestBed.inject(SurveyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const answer: IAnswer = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const question: IQuestion = { id: 'a0a4763f-9011-4a79-a28f-52c057dd593c' };
      answer.question = question;

      const questionCollection: IQuestion[] = [{ id: 'abe87d22-a7e9-4149-83ef-1fe22add942a' }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ answer });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(questionCollection, ...additionalQuestions);
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Survey query and add missing value', () => {
      const answer: IAnswer = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const survey: ISurvey = { id: '591ad7fc-c0df-452e-8cd5-800b820ac69c' };
      answer.survey = survey;

      const surveyCollection: ISurvey[] = [{ id: '2fa89220-85f9-472d-b14e-5669c09627b0' }];
      jest.spyOn(surveyService, 'query').mockReturnValue(of(new HttpResponse({ body: surveyCollection })));
      const additionalSurveys = [survey];
      const expectedCollection: ISurvey[] = [...additionalSurveys, ...surveyCollection];
      jest.spyOn(surveyService, 'addSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ answer });
      comp.ngOnInit();

      expect(surveyService.query).toHaveBeenCalled();
      expect(surveyService.addSurveyToCollectionIfMissing).toHaveBeenCalledWith(surveyCollection, ...additionalSurveys);
      expect(comp.surveysSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const answer: IAnswer = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const question: IQuestion = { id: 'f64b7e5d-cfcb-4923-b456-34e27042e85c' };
      answer.question = question;
      const survey: ISurvey = { id: 'b74daf78-d860-4b06-b383-f53d848f42c5' };
      answer.survey = survey;

      activatedRoute.data = of({ answer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(answer));
      expect(comp.questionsSharedCollection).toContain(question);
      expect(comp.surveysSharedCollection).toContain(survey);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Answer>>();
      const answer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(answerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ answer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: answer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(answerService.update).toHaveBeenCalledWith(answer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Answer>>();
      const answer = new Answer();
      jest.spyOn(answerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ answer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: answer }));
      saveSubject.complete();

      // THEN
      expect(answerService.create).toHaveBeenCalledWith(answer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Answer>>();
      const answer = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(answerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ answer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(answerService.update).toHaveBeenCalledWith(answer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackQuestionById', () => {
      it('Should return tracked Question primary key', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const trackResult = comp.trackQuestionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSurveyById', () => {
      it('Should return tracked Survey primary key', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const trackResult = comp.trackSurveyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
