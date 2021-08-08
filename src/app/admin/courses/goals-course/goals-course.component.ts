import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LoadingProgressService } from 'src/app/loading-progress/loading-progress.service';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-goals-course',
  templateUrl: './goals-course.component.html',
  styleUrls: ['./goals-course.component.scss'],
  providers: [FalconMessageService],
})
export class GoalsCourseComponent implements OnInit, OnDestroy {
  targetForm: FormGroup;
  label_target = '  Học viên sẽ học được gì từ khóa học?';
  label_require = 'Yêu cầu, điều kiện tiên quyết để tham gia khóa học?';
  label_target_student = 'Ai phù hợp với khóa học này?';
  placeholder_target = 'Ví dụ: Có kiến thức sử dụng Microsoft SQL Server';
  placeholder_require = ' Ví dụ: Có khả năng đọc bản nhạc';
  placeholder_target_student = 'Ví dụ: Lập trình viên mới làm quen với python';
  idcourse: string;
  loading: boolean;
  unsubscription = new Subject();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private messageService: FalconMessageService,
    private route: ActivatedRoute,
    private loadingService: LoadingProgressService
  ) {}

  ngOnInit(): void {
    this.targetForm = this.initForm();

    this.route.params
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(({ id }) => {
          if (id) {
            this.idcourse = id;
            if (!this.coursesService.editCourseData) {
              return this.coursesService.findById(id);
            }
            return of(this.coursesService.editCourseData);
          } else {
            return of(null);
          }
        }),

        takeUntil(this.unsubscription)
      )
      .subscribe((val) => {
        this.loading = false;
        if (val) {
          const requires = this.targetForm.get('require') as FormArray;
          const goals = this.targetForm.get('goal') as FormArray;
          const targets = this.targetForm.get('target_student') as FormArray;
          requires.clear();
          goals.clear();
          targets.clear();

          val.require.forEach((item) => {
            requires.push(this.fb.group({ content: '' }));
          });

          val.goal.forEach((item) => {
            goals.push(this.fb.group({ content: '' }));
          });

          val.target_student.forEach((item) => {
            targets.push(this.fb.group({ content: '' }));
          });

          this.targetForm.patchValue({ ...val });
          if (!this.coursesService.editCourseData) {
            this.coursesService.editCourse.next(val);
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  initForm() {
    return this.fb.group({
      goal: this.fb.array([this.fb.group({ content: '' })]),
      require: this.fb.array([this.fb.group({ content: '' })]),
      target_student: this.fb.array([this.fb.group({ content: '' })]),
    });
  }

  onSubmit() {
    const goalsData = this.targetForm.value;
    if (!this.idcourse) {
      this.coursesService.newCourse.next({
        ...this.coursesService.newCourseData,
        ...goalsData,
      });
      this.loading = true;
      this.coursesService
        .create(this.coursesService.newCourseData)
        .pipe(takeUntil(this.unsubscription))
        .subscribe((val) => {
          this.loading = false;
          this.messageService.showSuccess('Thành công', 'Đã thêm khóa học');
          this.targetForm = this.initForm();
          this.coursesService.newCourse.next(null);
          this.router.navigate(['admin/courses/add/landing-page']);
        });
    } else {
      this.loading = true;
      const dataToSave = {
        ...this.coursesService.editCourseData,
        ...this.targetForm.value,
      };
      this.coursesService
        .update(dataToSave, this.idcourse)
        .pipe(takeUntil(this.unsubscription))
        .subscribe((val) => {
          this.loading = false;
          this.messageService.showSuccess('Thành công', 'Khóa học đã cập nhật');
        });
    }
  }

  onSave() {
    if (this.idcourse) {
      this.loadingService.showLoading();
      const dataToSave = {
        ...this.coursesService.editCourseData,
        ...this.targetForm.value,
      };

      this.coursesService
        .update(dataToSave, this.idcourse)
        .pipe(takeUntil(this.unsubscription))
        .subscribe(
          (val) => {
            console.log(val);
            this.loadingService.hideLoading();
            this.messageService.showSuccess(
              'Thành công',
              'Khóa học đã được cập nhật'
            );
            this.coursesService.editCourse.next(val);
          },
          (err) => {
            this.loadingService.hideLoading();
            this.messageService.showError('Thất bại', 'Đã có lỗi xảy ra');
          }
        );
    }
  }

  prevPage() {
    if (this.idcourse) {
      this.router.navigate(['admin/courses/edit', this.idcourse, 'curriculum']);
    } else {
      this.router.navigate(['admin/courses/add/curriculum']);
    }
  }
}
