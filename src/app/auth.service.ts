import { UserInterface } from './models/user';
import { UserService } from './user.service';
import { AppUser } from './models/app-user';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute) {
      this.user$ = this.afAuth.authState;
   }

  private setReturnUrl() {
    // tslint:disable-next-line:prefer-const
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'; // get current url from urlBar
    localStorage.setItem('returnUrl', returnUrl);
  }

  googleLogin() {
    this.setReturnUrl();
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  facebookLogin() {
    this.setReturnUrl();
    this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  twitterLogin() {
    this.setReturnUrl();
    this.afAuth.auth.signInWithRedirect(new firebase.auth.TwitterAuthProvider()).then(res => console.log(res));
  }

  async userRegister(user: UserInterface) {
    this.setReturnUrl();
    let uid = await this.createUser(user);
    this.userService.updateUser(user, uid);
  }

  createUser(user: UserInterface) {
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((res) => res.user.uid);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  get appUser$(): Observable<AppUser> {
    return this.user$
      .pipe(
        switchMap(user => {
          if (user)
            return this.userService.get(user.uid).valueChanges();
          else
            return of(null);
        })
      );
  }
}
