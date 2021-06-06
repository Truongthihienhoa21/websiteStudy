import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, from, Subscription } from 'rxjs';
import { catchError, mergeMap, mergeMapTo, tap, toArray } from 'rxjs/operators';
import { Category } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';
import { CheckCategoryName } from '../../../shared/validators/check-category-name';

import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  providers: [SwalAlertComponent],
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  initialCategory: Partial<Category> = {
    title: '',
    img: '',
    desc: '',
    idparent: '',
    group: '',
  };
  sub: Subscription;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private checkCategoryName: CheckCategoryName,
    private swal: SwalAlertComponent,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      selector: this.createCategory(this.initialCategory),
      list: this.fb.array([]),
    });
  }

  createCategory(category: Partial<Category>): FormGroup {
    return this.fb.group({
      title: [
        category.title || '',
        Validators.compose([Validators.required]),
        this.checkCategoryName.validate,
      ],
      img: [category.img || ''],
      idparent: [category.idparent || ''],
      desc: [category.desc || '', Validators.compose([Validators.required])],
      group: [category.group || ''],
    });
  }

  get listForm(): FormArray {
    return this.categoryForm.get('list') as FormArray;
  }

  addCategory(category: Category) {
    this.listForm.push(this.createCategory(category));
  }

  onRemove({ item, index }) {
    this.listForm.removeAt(index);
  }

  onSubmit() {
    const { list } = this.categoryForm.value;

    const save = from(list).pipe(
      mergeMap((val) => this.categoryService.create(val)),
      toArray()
    );

    this.sub = save
      .pipe(
        tap(() => {
          this.loading.loadingOn();
        })
      )
      .subscribe(() => {
        this.categoryForm.get('selector').reset();
        this.listForm.clear();
        this.loading.loadingOff();
        this.swal.swalSuccess(null, 'Category Created!');
      });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
