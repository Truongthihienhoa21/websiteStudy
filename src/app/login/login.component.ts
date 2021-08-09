import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import {
  catchError,
  finalize,
  switchMap,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { CategoryService } from '../service/category.service';
import { CoursesService } from '../service/courses.service';
import { FalconMessageService } from '../service/falcon-message.service';
import { PreviousRouteService } from '../service/previous-route.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [FalconMessageService],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  submitted = false;
  loginFail = false;
  sub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private coursesService: CoursesService,
    private previousRouteService: PreviousRouteService,
    private messageService: FalconMessageService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loginFail = false;

    // stop here if form is invalid
    if (this.form.invalid) {
      this.messageService.showError('Error', 'Please input all fields');
      return;
    }

    this.loading = true;

    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    };

    // send request to server here
    const login = this.authService.login(user.username, user.password);
    this.sub = combineLatest([
      login,
      this.previousRouteService.prevRoute,
    ]).subscribe(
      ([login, prevRoute]) => {
        if (localStorage.getItem('typeUser') === 'admin') {
          this.router.navigateByUrl('/admin');
        }

        else {
          localStorage.setItem('logged', 'true');
          this.messageService.showSuccess('Success', 'Login success');
          this.coursesService.getCoursesLocal();
          this.authService.isLoginClient$.next(true);
          if (prevRoute) {
            this.router.navigateByUrl(prevRoute);
          } else {
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 1000);
          }
        }
      },
      (err) => {
        this.loading = false;
        this.loginFail = true;
        this.messageService.showError('Error', 'Invalid credential');
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
