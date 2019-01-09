import { AuthService } from './../auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any = {};
  constructor(private auth: AuthService) { }

  googleLogin() {
    this.auth.googleLogin();
  }

  facebookLogin() {
    this.auth.facebookLogin();
  }

  twitterLogin() {
    this.auth.twitterLogin();
  }

  userRegister() {
    this.auth.userRegister(this.user);
  }

}
