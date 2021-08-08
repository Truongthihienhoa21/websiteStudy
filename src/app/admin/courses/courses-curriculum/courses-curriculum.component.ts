import { LoadingProgressService } from './../../../loading-progress/loading-progress.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap, finalize } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-courses-curriculum',
  templateUrl: './courses-curriculum.component.html',
  styleUrls: ['./courses-curriculum.component.scss'],
  providers: [FalconMessageService],
})
export class CoursesCurriculumComponent implements OnInit, OnDestroy {
  formCurriculum: FormGroup;
  idcourse: string;
  unsubscription = new Subject();
  dataCourse: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private messageService: FalconMessageService,
    private loadingService: LoadingProgressService
  ) { }

  ngOnInit(): void {
    this.formCurriculum = this.initForm();
    this.route.params
      .pipe(
        tap((val) => this.loadingService.showLoading()),
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
      .subscribe((val: any) => {
        if (val) {

          this.dataCourse = val;
          const form = this.formCurriculum.get('section') as FormArray;
          form.clear();

          const sections: any[] = val.section;

          sections.forEach((sec) => {
            const section = this.detailSection();
            form.push(section);

            const lecture = section.get('chapter') as FormArray;
            lecture.clear();

            sec.chapter.forEach((chap) => {
              lecture.push(this.detailChapter());
            });
          });

          this.formCurriculum.patchValue({ ...val });

          if (!this.coursesService.editCourseData) {
            this.coursesService.editCourse.next(val);
          }
          this.loadingService.hideLoading();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  initForm() {
    return this.fb.group({
      section: this.fb.array([this.detailSection()]),
    });
  }

  detailSection() {
    return this.fb.group({
      title: '',
      chapter: this.fb.array([this.detailChapter()]),
    });
  }

  detailChapter() {
    return this.fb.group({
      title: '',
      html: '',
      videoUrl: '',
      pdfUrl: '',
      videoUrl2: '',
      article_lecture: '',
    });
  }

  addLecture(sectionItem) {
    const chapters = sectionItem.get('chapter') as FormArray;
    chapters.push(this.detailChapter());
  }

  addSection() {
    const sections = this.formCurriculum.get('section') as FormArray;
    sections.push(this.detailSection());
  }

  onSubmit() {
    if (this.idcourse) {
      this.loadingService.showLoading();
      const dataToSave = {
        ...this.coursesService.editCourseData,
        ...this.formCurriculum.value,
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
      this.router.navigate([
        'admin/courses/edit',
        this.idcourse,
        'landing-page',
      ]);
    } else {
      this.router.navigate(['admin/courses/add/landing-page']);
    }
  }

  nextPage() {
    const curriculumData = this.formCurriculum.value;

    if (this.idcourse) {
      this.coursesService.editCourse.next({
        ...this.coursesService.editCourseData,
        ...curriculumData,
      });
      this.router.navigate(['admin/courses/edit', this.idcourse, 'goals']);
    } else {
      this.coursesService.newCourse.next({
        ...this.coursesService.newCourseData,
        ...curriculumData,
      });
      this.router.navigate(['admin/courses/add/goals']);
    }
  }

  checkForm() {
    let valid;
    if (this.formCurriculum.invalid) {
      valid = false;
      this.messageService.showError('Error', 'Please input all fields');
    }

    return valid;
  }
}
