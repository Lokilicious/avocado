import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, switchMap } from 'rxjs';
import { Team } from '../../entities/team/team.model';
import { ApiService } from '../../services/api.service';
import { Survey } from '../../entities/survey/survey.model';
import { map } from 'rxjs/operators';
import { take } from 'cypress/types/lodash';
import { IQuestion, Question } from 'app/entities/question/question.model';
import { Answer } from 'app/entities/answer/answer.model';
import { Dayjs } from 'dayjs/esm';

@Component({
  selector: 'jhi-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  public teamId = '';
  public surveys$: Observable<Survey[]> | undefined;
  public questions: Array<IQuestion | undefined | null> = [];
  public answerMap: Map<Dayjs | null, Answer> = new Map;
  public surveyDates: Array<Date> = [];


  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.teamId = params.id;

        this.surveys$ = this.apiService.getSurveys().pipe(map(surveys => surveys.filter(s => s.team?.id === this.teamId).slice(0, 3)));

       
        this.surveys$.subscribe(surveys => {
          surveys[0].answers?.forEach(a => {
            if(a.question !== undefined) {
              this.questions.push(a.question);
            }
              //this.answerMap.set(a.question, a);
          });

        

          surveys.forEach(s => {
            s.answers?.forEach(a => {
              if(s.surveyDate !== undefined) {
                this.answerMap.set(s.surveyDate, a);
              }
                
            })
          });           
           
         });


      }
    });
  }
}
