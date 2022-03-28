import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, switchMap } from 'rxjs';
import { Team } from '../../entities/team/team.model';
import { ApiService } from '../../services/api.service';
import { Survey } from '../../entities/survey/survey.model';
import { map } from 'rxjs/operators';

import { IQuestion, Question } from 'app/entities/question/question.model';
import { Answer, IAnswer } from 'app/entities/answer/answer.model';


@Component({
  selector: 'jhi-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  public teamId = '';
  public surveys$: Observable<Survey[]> | undefined;
  public surveyDates: Array<Date | undefined> = [];
  public map: Map<string , Answer[]> = new Map; 
  public sanitizedSurveys:SanitizedSurvey[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.teamId = params.id;

        this.surveys$ = this.apiService.getSurveys().pipe(map(surveys => surveys.filter(s => s.team?.id === this.teamId).slice(0, 3)));
       
        this.surveys$.subscribe(surveys => {         
          const numAnswers = surveys[0].answers?.length ?? 0;

          for(let i = 0; i < numAnswers; i++){
            const results:Answer[] = []; 
            const ss:SanitizedSurvey = {question : '', order: 0, answers: []};
            surveys.forEach(s => {
              // this.surveyDates.push(s.surveyDate?.toDate());
              if(s.answers){
                ss.answers.push(s.answers[i])
                ss.question = s.answers[i].question?.text ?? '';
                ss.order = s.answers[i].order;
                
              }
            });
            
            this.sanitizedSurveys.push(ss);
          }           
         });
      }
    });
  }
}

export interface SanitizedSurvey {
  question: string
  order: number | null | undefined
  answers: IAnswer[]
}