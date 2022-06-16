import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, tap } from 'rxjs';
import * as UserSelectors from '../+state/user.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  token$ = this.store.select(UserSelectors.getToken);

  constructor(
        private router: Router,
        private store : Store
    ) { }

    canActivate(): Observable<boolean> {
      return this.token$.pipe(
        map(token => token !== ''),
        tap((token) => {
          if(!token) {
            this.router.navigate(['/login']);
          }
        })
      );
    }
}
