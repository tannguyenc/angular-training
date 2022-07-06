import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, tap } from 'rxjs';
import * as UserSelectors from '../+state/user.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  tokenStore$ = this.store.select(UserSelectors.getToken);
  token$ = localStorage.getItem("token");

  constructor(
    private router: Router,
    private store: Store
  ) { }

  canActivate(): Observable<boolean> {
    if (this.token$ === null || !this.token$) {
      return this.tokenStore$.pipe(
        map(token => token !== ''),
        tap((hasToken) => {
          if (!hasToken) {
            this.router.navigate(['/login']);
          }
        })
      );
    }
    return of(true);
  }

  // canActivate(): boolean {
  //   console.log(this.token$);
  //   if (this.token$ === null || !this.token$) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  //   return true;
  // }
}
