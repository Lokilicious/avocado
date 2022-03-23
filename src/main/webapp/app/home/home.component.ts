import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { Team } from '../entities/team/team.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  teams$: Observable<Team[]> | undefined;

  constructor(private accountService: AccountService, private loginService: LoginService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.account = account));

    this.teams$ = this.apiService.getTeams();
  }

  login(): void {
    this.loginService.login();
  }
}
