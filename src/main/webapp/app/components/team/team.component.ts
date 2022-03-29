import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, switchMap } from 'rxjs';
import { Team } from '../../entities/team/team.model';
import { ApiService } from '../../services/api.service';
import { Survey } from '../../entities/survey/survey.model';
import { map } from 'rxjs/operators';

import { IQuestion, Question } from 'app/entities/question/question.model';
import { Answer, IAnswer } from 'app/entities/answer/answer.model';
import { StringNullableChain } from 'cypress/types/lodash';


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
  public backgroundColor = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.teamId = params.id;

        this.surveys$ = this.apiService.getSurveys().pipe(map(surveys => surveys.filter(s => s.team?.id === this.teamId).slice(0, 3)));
       
        this.surveys$.subscribe(surveys => {         
          const numAnswers = surveys[0].answers?.length ?? 0;

          surveys.sort((a,b) => ((a.surveyDate ?? new Date()) > (b.surveyDate ?? new Date()) ? 1 : -1));

          surveys.forEach(s => {
            if(typeof s.surveyDate === "string"){
              this.surveyDates.push(new Date(s.surveyDate));
            }
          });

          for(let i = 0; i < numAnswers; i++){
            const results:Answer[] = []; 
            const ss:SanitizedSurvey = {question : '', order: 0, answers: []};
            surveys.forEach(s => {
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

  public getBackgroundColor(value : number | null | undefined) : string {
    const h = (value! - 1) / 8 ;
    return this.RGBtoHex(this.HSVtoRGB(h, 0.6, 1))
  };

  private RGBtoHex(color: Color): string{
      let r = color.r.toString(16);
      if(r.length < 2) {
        r = '0' + r;
      }
      let g = color.g.toString(16);
      if(g.length < 2) {
        g = '0' + g;
      }
      let b = color.b.toString(16);
      if(b.length < 2) {
        b = '0' + b;
      }
      return '#'+r + g + b;
  }

  private HSVtoRGB(h: number, s: number, v: number) : Color {
      let r: number, g: number, b: number;
      
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
      }
      return {
          r: Math.floor(r! * 255),
          g: Math.floor(g! * 255),
          b: Math.floor(b! * 255)
      };
    }
}

export interface Color {
  r: number
  g: number
  b: number
}

export interface SanitizedSurvey {
  question: string
  order: number | null | undefined
  answers: IAnswer[]
}