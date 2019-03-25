import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = this.fb.group(({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  }));
  public errorLog: string;

  constructor(
    private fb: FormBuilder,
    private api: TodoService,
    private auth: UserService,
    private router: Router,
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
    this.auth.login(this.loginForm.value).subscribe(
      res => {
        this.cookieService.set( 'token', res.userId );
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
