import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Accordion } from 'primeng/accordion';
import { combineLatest, Observable, pipe, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { LoadingProgressService } from 'src/app/loading-progress/loading-progress.service';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.scss'],
  providers: [FalconMessageService]
})
export class CoursesDetailComponent implements OnInit, OnDestroy {
  course: any;
  displayBasic = false;
  showmore = false;
  relatedCourses: any;
  loadRelatedCourse = new Subject();
  unsubscription$ = new Subject();
  userForm: FormGroup;
  displayDialog: boolean;
  currentUserId: any;
  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router,
    private fb: FormBuilder,
    private loadingProgress: LoadingProgressService,
    private authService: AuthService,
    private messageService: FalconMessageService,
  ) { }

  ngOnInit(): void {
    this.userForm = this.initForm();
    this.authService.userInfo.pipe(takeUntil(this.unsubscription$)).subscribe(
      val => { this.currentUserId = val }
    )

    this.route.params
      .pipe(
        switchMap(({ id }) => {
          const course = this.coursesService.findById(id);
          return combineLatest([course, this.coursesService.courseInCart]);
        }),

        takeUntil(this.unsubscription$)
      )
      .subscribe(
        ([course, courseInCart]: any[]) => {
          this.course = { ...course, incart: false };
          if (courseInCart.find((item) => item._id === course._id)) {
            this.course['incart'] = true;
          }
          this.loadRelatedCourse.next();
        }
      );

    this.loadRelatedCourse
      .pipe(switchMap(() => this.getRelatedCourses()))
      .subscribe((val) => {
        this.relatedCourses = val;
      });
  }

  initForm() {
    return this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.unsubscription$.next();
    this.unsubscription$.unsubscribe();
  }

  getRelatedCourses() {
    const category = this.course.category.value;
    const id = this.course._id;
    const query = {
      $and: [{ 'category.value': `${category}` }, { _id: { $ne: `${id}` } }],
    };
    const params = new HttpParams()
      .set('fields', 'img,title,rating,student,price')
      .set('query', JSON.stringify(query))
      .set('limit', '5')
      .set('sort', JSON.stringify({ student: -1 }));
    return this.coursesService.find(params);
  }

  showDialog() {
    this.displayBasic = true;
  }

  closeDialog() {
    this.displayBasic = false;
  }

  addToCart(course) {
    // console.log(course);

    if (!this.currentUserId && !localStorage.getItem('userInfo')) {
      this.displayDialog = true;
    } else {
      if (course.incart) {
        this.router.navigateByUrl('/cart');
      } else {
        course.incart = true;
        this.coursesService.setCourseInCart(course);
      }
    }
  }

  expandAll(accor: Accordion) {
    const length = accor.tabList.length;
    let index = [];
    for (let i = 0; i < length; i++) {
      index.push(i);
    }
    accor.activeIndex = index.join(',');
  }

  onLogin() {
    if (this.userForm.invalid) {
      return;
    }
    const { username, password } = this.userForm.value;
    this.loadingProgress.showLoading();
    this.authService
      .login(username, password)
      .pipe(takeUntil(this.unsubscription$))
      .subscribe(
        (val) => {
          this.loadingProgress.hideLoading();
          this.displayDialog = false;
          localStorage.setItem('logged', 'true');
          this.authService.isLoginClient$.next(true);
          this.messageService.showSuccess('Success', 'Đăng nhập thành công');
        },
        (err) => {
          this.loadingProgress.hideLoading();
          this.messageService.showError('Error', 'Invalid credential');
        }
      );
  }
}


