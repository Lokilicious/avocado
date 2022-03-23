import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { Team } from '../entities/team/team.model';

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
}
