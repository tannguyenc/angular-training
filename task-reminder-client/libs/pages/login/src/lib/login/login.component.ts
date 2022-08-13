import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as UserActions from '@task-reminder-client/states/user';
import * as UserSelectors from '@task-reminder-client/states/user';
import { IUserGoogle } from 'libs/datas/user';

declare let google: any;

@Component({
  selector: 'task-reminder-client-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy, OnInit, AfterViewInit {

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  user!: IUserGoogle;
  googleClient: any;
  // checkCallToken$ = this.store.select(UserSelectors.checkCallToken);

  private _sub: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store,
  ) {

  }

  ngOnInit(): void {
    // this.socialAuthService.authState.subscribe((user: SocialUser) => {
    //   if (user) {
    //     this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)
    //       .then((accessToken: string) => {
    //         if (accessToken) {
    //           this.store.dispatch(UserActions.loginWithGoogle({ email: user.email, fullname: user.name, photoUrl: user.photoUrl, accessToken: accessToken }));
    //         }
    //       });
    //   }
    // });
  }

  ngAfterViewInit(): void {
    this.googleClient = google.accounts.oauth2.initCodeClient({
      client_id: '563919799549-l37pui6624jnr4j39n20aqvg83jvk54b.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/tasks \
      https://www.googleapis.com/auth/tasks.readonly',
      ux_mode: 'popup',
      callback: (resp: IUserGoogle) => {
        console.log('code');
        console.log(resp);
        if (resp) {
          this.store.dispatch(UserActions.loginWithGoogle({ email: this.user.email, fullname: this.user.name, photoUrl: this.user.picture, accessToken: resp.code }));
        }
      },
    });

    google.accounts.id.initialize({
      client_id: "563919799549-l37pui6624jnr4j39n20aqvg83jvk54b.apps.googleusercontent.com",
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", shape: "pill" }  // customization attributes
    );
  }

  handleGoogleSignIn(response: any) {
    // This next is for decoding the idToken to an object if you want to see the details.
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    this.user = JSON.parse(jsonPayload) as IUserGoogle;
    if (this.user) {
      this.store.dispatch(UserActions.checkCallOAuthGoogle({ email: this.user.email }));
      this.store.select(UserSelectors.checkCallToken).subscribe(hasCallToken => {
        console.log(hasCallToken);
        if (!hasCallToken) {
          this.googleClient.requestCode();
        } else {
          console.log('home');
          console.log(this.router);
          this.store.dispatch(UserActions.loginWithGoogle({ email: this.user.email, fullname: this.user.name, photoUrl: this.user.picture, accessToken: '' }));
        }
      });
    }
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
