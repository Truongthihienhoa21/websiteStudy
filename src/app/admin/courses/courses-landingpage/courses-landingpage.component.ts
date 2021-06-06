import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-courses-landingpage',
  templateUrl: './courses-landingpage.component.html',
  styleUrls: ['./courses-landingpage.component.scss'],
  providers: [FalconMessageService],
})
export class CoursesLandingpageComponent implements OnInit, OnDestroy {
  formLandingPage: FormGroup;
  cities: any[];
  levels: any[];
  categories: any[];
  idcourse: string;
  loading: boolean;
  unsubscription = new Subject();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private messageService: FalconMessageService
  ) { }

  ngOnInit(): void {
    this.formLandingPage = this.initForm();

    this.route.params
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(({ id }) => {
          if (id) {
            this.idcourse = id;
            return this.coursesService.findById(id);
          } else {
            return of(null);
          }
        }),
        takeUntil(this.unsubscription)
      )
      .subscribe((val: any) => {
        this.loading = false;
        if (val) {
          this.formLandingPage.patchValue({ ...val });
        }
      });

    this.coursesService
      .getCountries()
      .pipe(takeUntil(this.unsubscription))
      .subscribe((val) => (this.cities = val));

    this.levels = [
      { name: 'Beginner', value: 'Beginner' },
      { name: 'Intermediate', value: 'Intermediate' },
      { name: 'Expert', value: 'Expert' },
      { name: 'All level', value: 'All level' },
    ];
    this.categories = [
      { name: 'Development', value: 'dev' },
      { name: 'Business', value: 'business' },
      { name: 'Marketing', value: 'marketing' },
      { name: 'Design', value: 'design' },
    ];
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  initForm() {
    return this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      html: ['', Validators.required],
      language: [null, Validators.required],
      level: [null, Validators.required],
      category: [null, Validators.required],
      img: ['', Validators.required],
      preview_video: ['', Validators.required],
      price: [null, Validators.required],
      discount: [null],
    });
  }

  onSubmit() {
    const valid = this.checkForm();
    if (!valid) {
      return;
    }
    const value = this.formLandingPage.value;
  }

  nextPage() {
    const valid = this.checkForm();
    // console.log(valid);

    if (!valid) {
      return;
    }
    // console.log(123);

    const landingPageData = this.formLandingPage.value;
    this.coursesService.newCourse.next({
      ...this.coursesService.newCourseData,
      ...landingPageData,
    });

    if (this.idcourse) {
      this.router.navigate(['admin/courses/edit', this.idcourse, 'curriculum']);
    } else {
      this.router.navigate(['admin/courses/add/curriculum']);
    }
  }

  checkForm() {
    let valid = true;
    if (this.formLandingPage.invalid) {
      valid = false;
      this.messageService.showError('Error', 'Please input all fields');
    }

    return valid;
  }
}
