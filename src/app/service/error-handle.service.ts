import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandleService {
  constructor(private authService: AuthService, private router: Router) { }

  handleError(error: any) {
    // console.log(error, 2323232);
    switch (error.name) {
      case 'InvalidCredentialsError':
        // this.authService.setUser().subscribe();
        break;
      case 'NotFoundError':
        this.router.navigateByUrl('not-found');
    }
  }
}
