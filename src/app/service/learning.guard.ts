import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LearningGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const idcourse = next.params.id;
    return this.authService.userInfo.pipe(
      switchMap((id) => this.authService.getUserLearning(id)),
      map((learning) => {
        if (!learning || !learning.includes(idcourse)) {
          alert("some thing wen't wrong");
          this.router.navigateByUrl('/');
          return false;
        }
        return true;
      })
    );
  }
}
