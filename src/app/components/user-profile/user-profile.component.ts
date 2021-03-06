import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public editPasswordForm: FormGroup = this.fb.group({
    password: ['', [Validators.minLength(5), Validators.required]]
  });
  public editInfo: string;

  constructor(
    private fb: FormBuilder,
    private auth: UserService,
  ) { }

  ngOnInit() {
  }

  public get formControls(): any {
    return this.editPasswordForm.controls;
  }

  public editUserPassword(formDirective: FormGroupDirective): void {
    this.auth.editPassword(this.editPasswordForm.value).subscribe(
      res => {
        this.editInfo = 'Password was updated';
        formDirective.resetForm();
        this.editPasswordForm.reset();
      },
      err => {
        if (err.status === 401) {
          this.editInfo = err.error;
        } else {
          this.editInfo = 'Server Error';
        }
      });
  }

}
