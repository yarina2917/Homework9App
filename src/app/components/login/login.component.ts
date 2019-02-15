import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = this.fb.group(({
    name: ['', [Validators.required]],
    password: ['', [Validators.required]]
  }));
  public errorLog: string;

  constructor(
    private fb: FormBuilder,
    private api: UserService,
    private router: Router,
    private auth: UserService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.auth.loggedIn()) {
      this.router.navigate(['/todo']);
    }
  }

  public get formControls(): any {
    return this.loginForm.controls;
  }

  public loginUser(): void {
    this.api.login(this.loginForm.value).subscribe(
      res => {
        this.cookieService.set( 'token', res['token'] );
        this.router.navigate(['/todo']);
      },
      err => {
        if (err.status === 401) {
          this.errorLog = err.error;
        } else {
          this.errorLog = 'Server Error';
        }
      });
  }

}
