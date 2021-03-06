import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'https://homework9server.herokuapp.com';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) { }

  public getToken(): string {
    return this.cookieService.get('token');
  }

  public loggedIn(): boolean {
    return !!this.getToken();
  }

  public logout(): void {
    this.cookieService.delete('token');
  }

  public register(body): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(`${this.apiUrl}/api/registration`, body, httpOptions);
  }

  public login(body): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-apikey': this.getToken()
      })
    };
    return this.http.post(`${this.apiUrl}/api/login`, body, httpOptions);
  }

  public editPassword(body): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-apikey': this.getToken()
      })
    };
    return this.http.put(`${this.apiUrl}/api/user`, body, httpOptions);
  }

}
