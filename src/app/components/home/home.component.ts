import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isLoggedValue: boolean;

  constructor(private auth: UserService) { }

  ngOnInit() {
    this.isLoggedValue = true;
  }

  public isLogged(): void {
    this.isLoggedValue = this.auth.loggedIn();
  }

}
