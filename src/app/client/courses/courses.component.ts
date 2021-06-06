import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { LoadingProgressService } from 'src/app/loading-progress/loading-progress.service';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [FalconMessageService],
})
export class CoursesComponent implements OnInit, OnDestroy {
  displayBasic = false;
  currentIndex: number;
  courses: any[] = [];

  sortPriceOptions: any[];
  sortCategoriesOptions: any[];
  sortOrder: number;
  sortField: string;
  displayDialog: boolean;
  currentUserId: any;
  userForm: FormGroup;
  unsubscription = new Subject();
  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: FalconMessageService,
    private loadingProgress: LoadingProgressService
  ) {}

  ngOnInit(): void {
    this.userForm = this.initForm();
    this.sortPriceOptions = [
      { label: 'Giá thấp đến cao', value: 'price' },
      { label: 'Giá cao đến thấp', value: '!price' },
      { label: 'Mới nhất', value: 'new' },
      { label: 'Cũ nhất', value: 'old' },
    ];

    this.sortCategoriesOptions = [
      { label: 'Development', value: 'dev' },
      { label: 'Business', value: 'business' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Design', value: 'design' },
    ];

    const courseInCart: Observable<any[]> =
      this.coursesService.courseInCart.asObservable();
    const totalCourses: Observable<any[]> = this.coursesService.find();

    const coursesHasBuy: Observable<any[]> = this.authService.userInfo.pipe(
      tap((id) => (this.currentUserId = id)),
      mergeMap((id) => {
        if (id) {
          return this.authService.getUserLearning(id);
        } else {
          return of([]);
        }
      })
    );
    combineLatest([totalCourses, courseInCart, coursesHasBuy])
      .pipe(
        map(([courses, courseIncart, coursesHasBuy]) => {
          let result = [...courses];

          if (coursesHasBuy && coursesHasBuy.length > 0) {
            result = result.filter((item) => !coursesHasBuy.includes(item._id));
          }

          result = result.map((course) => ({
            ...course,
            inCart: courseIncart.some((item) => item._id === course._id),
          }));

          return result;
        }),
        takeUntil(this.unsubscription)
      )
      .subscribe((val) => {
        this.courses = val;
      });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  initForm() {
    return this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  showBasicDialog(index?) {
    this.currentIndex = index;
    this.displayBasic = true;
  }

  closeBasicDialog() {
    this.displayBasic = false;
  }

  onNavigate(id: string) {
    this.router.navigate(['category/courses', id]);
  }

  onSortChange(event) {
    let value = event.value;
    switch (value) {
      case '!price':
        this.sortOrder = -1;
        this.sortField = 'price';
        break;
      case 'price':
        this.sortOrder = 1;
        this.sortField = 'price';
        break;
      case 'new':
        this.sortOrder = -1;
        this.sortField = '_kmd.ect';
        break;
      case 'old':
        this.sortOrder = 1;
        this.sortField = '_kmd.ect';
        break;
    }
  }

  addToCart(course) {
    if (!this.currentUserId && localStorage.getItem('logged') !== 'true') {
      this.displayDialog = true;
    } else {
      if (course.inCart) {
        this.router.navigateByUrl('/cart');
      } else {
        course.inCart = true;
        this.coursesService.setCourseInCart(course);
      }
    }
  }

  onLogin() {
    if (this.userForm.invalid) {
      return;
    }
    const { username, password } = this.userForm.value;
    this.loadingProgress.showLoading();
    this.authService
      .login(username, password)
      .pipe(takeUntil(this.unsubscription))
      .subscribe(
        (val) => {
          this.loadingProgress.hideLoading();
          this.displayDialog = false;
          localStorage.setItem('logged', 'true');
          this.authService.isLoginClient$.next(true);
          this.messageService.showSuccess('Success', 'Login success');
        },
        (err) => {
          this.loadingProgress.hideLoading();
          this.messageService.showError('Error', 'Invalid credential');
        }
      );
  }

  onChangePage() {
    window.scrollTo(0, 0);
  }
}
