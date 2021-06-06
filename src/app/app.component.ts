import { AuthService } from 'src/app/service/auth.service';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  constructor(private authService: AuthService) {
    this.authService.userDetail$.subscribe(val => this.authService.checkUserIsAdmin(val));
    this.authService.userInfo.subscribe(val => {
      if (val === null) {
        this.authService.isAdminSubject$.next(false)
      }
    })
  }

  ngOnDestroy() { }
}
