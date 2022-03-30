import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { Team } from '../entities/team/team.model';
import { Survey } from '../entities/survey/survey.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBaseUrl: string;

  constructor(private applicationConfigService: ApplicationConfigService, private http: HttpClient) {
    this.apiBaseUrl = applicationConfigService.getEndpointFor('api');
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiBaseUrl}/teams`);
  }

  getTeam(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiBaseUrl}/teams/${id}`);
  }

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiBaseUrl}/surveys`);
  }

  uploadSurvey(formData: FormData, id: string): Observable<Survey> {
    const s = this.http.post<Survey>(`${this.apiBaseUrl}/teams/${id}/survey/import`, formData, {reportProgress: true});
    return s
  }
}
