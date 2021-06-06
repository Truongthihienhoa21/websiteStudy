import { LoadingProgressService } from './../../../loading-progress/loading-progress.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, of, Subject } from 'rxjs';
import {
  filter,
  finalize,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs/operators';
import { Category, Post } from 'src/app/model/model';

import { LessonService } from 'src/app/service/lesson.service';
import { CategoryService } from 'src/app/service/category.service';
import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  providers: [SwalAlertComponent],
})
export class AddPostComponent implements OnInit, OnDestroy {
  addPostForm: FormGroup;
  nameCategory: Partial<Category>[];

  idSelect: string;
  isEdit: boolean;

  unsubscribeSignal: Subject<void> = new Subject();
  unSub$ = this.unsubscribeSignal.asObservable();

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private swal: SwalAlertComponent,
    private loading: LoadingProgressService
  ) {
    this.addPostForm = this.initForm();
    const nameCategory$ = this.categoryService.find().pipe(
      mergeMap((val) => from(val)),
      map((val) => ({
        _id: val['_id'],
        title: val['title'],
      })),
      toArray(),
      takeUntil(this.unSub$)
    );

    const post$ = this.route.params.pipe(
      tap((val) => {
        if (val['id']) {
          this.isEdit = true;
        }
      }),
      switchMap((val) => {
        if (val['id']) {
          return this.lessonService.findById<Post>(val['id']);
        } else {
          return of(null);
        }
      }),
      takeUntil(this.unSub$)
    );

    combineLatest([nameCategory$, post$]).subscribe(([nameCategory, post]) => {
      this.nameCategory = nameCategory;
      if (post) {
        {
          const valueForm = { ...post };
          this.idSelect = valueForm.idcha;
          const item = this.nameCategory.find((item) => {
            return item._id === valueForm.idcha;
          });

          if (item) valueForm.idcha = item.title;

          this.addPostForm.patchValue({ ...valueForm });
        }
      }
    });
  }

  ngOnInit(): void { }

  initForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      img: ['', [Validators.required]],
      html: ['', [Validators.required]],
      group: [''],
      content: ['', [Validators.required]],
      idcha: ['', [Validators.required]],
      _id: '',
    });
  }

  onSubmit() {
    this.loading.showLoading();

    const newpost: Post = this.addPostForm.value;
    newpost.idcha = this.idSelect;

    if (!this.isEdit) delete newpost._id;

    if (!this.isEdit) {
      delete newpost._id;
      this.lessonService
        .create(newpost)
        .pipe(
          finalize(() => this.loading.hideLoading()),
          takeUntil(this.unSub$)
        )
        .subscribe(
          (val) => {
            const post: Partial<Post> = {
              _id: val._id,
              title: val.title,
            };
            this.lessonService.updatePost(post, 'create');
            this.swal.swalSuccess(null, 'Thêm post thành công');

            this.addPostForm.reset();
          },
          (err) => {
            if (err.request.status === 0) {
              this.swal.swalError500();
            }
          }
        );
    } else {
      this.lessonService
        .update(newpost, newpost._id)
        .pipe(
          finalize(() => this.loading.hideLoading()),
          takeUntil(this.unSub$)
        )
        .subscribe(
          (val) => {
            const post: Partial<Post> = {
              _id: val._id,
              title: val.title,
            };
            this.lessonService.updatePost(post, 'update');
            this.router.navigateByUrl('admin/edit-post');
            this.swal.swalSuccess(null, 'Post updated');
          },
          (err) => {
            if (err.request.status === 0) {
              this.swal.swalError500();
            }
          }
        );
    }
  }

  onChange(e) {
    const name = e.target.value;
    const list = this.nameCategory.find((item) => item.title === name);

    if (list) this.idSelect = list._id;
  }

  ngOnDestroy() {
    this.unsubscribeSignal.next();
    this.unsubscribeSignal.unsubscribe();
  }
}
