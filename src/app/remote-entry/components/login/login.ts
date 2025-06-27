declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentService } from '../../../../environments/environment.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly router = inject(Router);
  private readonly _envService = inject(EnvironmentService);
  private readonly googleClientId = this._envService.get('googleClientId');
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: any) => {
        this.handleLogin(response);
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 250,
    });
  }
  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  handleLogin(response: any) {
    if (response) {
      const responsePayload = this.decodeToken(response.credential);
      sessionStorage.setItem('tmsuser', JSON.stringify(responsePayload));
      this.router.navigate(['accounts']);
    }
  }
}
