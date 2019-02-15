import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern('^[0-9]*$')],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });
  public errorRegistration: string;

  constructor(
    private fb: FormBuilder,
    private api: UserService,
    private router: Router,
    private auth: UserService
  ) {}

  ngOnInit() {
  }

  public get formControls(): any {
    return this.registerForm.controls;
  }

  public registerUser(): void {
    this.api.register(this.registerForm.value).subscribe(
      (res) => {
        if (this.auth.loggedIn()) {
          this.auth.logout();
        }
        this.router.navigate(['/login']);
      },
      err => {
        if (err.status === 401) {
          this.errorRegistration = err.error;
        } else {
          this.errorRegistration = 'Server Error';
        }
      });
  }
}

