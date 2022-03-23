import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, switchMap } from 'rxjs';
import { Team } from '../../entities/team/team.model';
import { ApiService } from '../../services/api.service';
import { Survey } from '../../entities/survey/survey.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'jhi-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  public teamId = '';
  public surveys$: Observable<Survey[]> | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.teamId = params.id;

        this.surveys$ = this.apiService.getSurveys().pipe(map(surveys => surveys.filter(s => s.team?.id === this.teamId).slice(0, 5)));
      }
    })
  }
}
