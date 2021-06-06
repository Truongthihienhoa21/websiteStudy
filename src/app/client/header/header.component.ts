import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';
import { PreviousRouteService } from 'src/app/service/previous-route.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  isLogin: Observable<boolean>;
  itemInCart$: Observable<number>;

  items = [
    {
      icon: 'pi pi-bell',
    },
    {
      icon: 'pi pi-shopping-cart',
      styleClass: 'cart',
      escape: false,
      routerLink: ['/cart'],
    },
    {
      icon: 'pi pi-user',
      items: [
        {
          label: 'My account',
          routerLink: ['/user-info'],
        },
        { label: 'My learning', routerLink: ['/category/learning'] },
        { label: 'My cart', routerLink: ['/cart'] },
        {
          label: 'Log out',
          command: () => this.logoutUser(),
        },
      ],
    },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService,
    private previousRouteService: PreviousRouteService
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('logged'))) {
      this.authService.isLoginClient$.next(true);
    }
    this.isLogin = this.authService.isLoginClient$.asObservable();
    this.itemInCart$ = this.coursesService.courseInCart
      .asObservable()
      .pipe(map((val) => val.length));
  }
  logoutUser() {
    this.authService.isLoginClient$.next(false);

    this.authService.logout();
    this.router.navigateByUrl('/');
    localStorage.setItem('logged', 'false');
    this.previousRouteService.setPrevRoute(null);
  }
}
