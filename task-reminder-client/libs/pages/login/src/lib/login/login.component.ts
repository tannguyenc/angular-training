import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as UserActions from '@task-reminder-client/states/user';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'task-reminder-client-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy, OnInit {

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  user: SocialUser | undefined;

  private _sub: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store,
    private socialAuthService: SocialAuthService,
  ) {

  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      if (this.user) {
        console.log('isuser');
        console.log(this.user);
        this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)
          .then(accessToken => {
            console.log(accessToken);
            if (accessToken) {
              console.log('istoken');
              this.store.dispatch(UserActions.loginWithGoogle({ email: user.email, fullname: user.name, photoUrl: user.photoUrl, accessToken: accessToken }));
            }
          });

      }
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    if (!!email && !!password) {
      this.store.dispatch(UserActions.login({ email, password }));
    }
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
