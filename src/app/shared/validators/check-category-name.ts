import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl, Validator } from '@angular/forms';
import { Query } from 'kinvey-angular-sdk';
import { debounceTime, map } from 'rxjs/operators';
import { CategoryService } from 'src/app/service/category.service';

@Injectable({ providedIn: 'root' })
export class CheckCategoryName implements AsyncValidator {
  constructor(private categoryService: CategoryService) {}
  validate = (formControl: FormControl) => {
    const name = formControl.value;
    const params = new HttpParams().set(
      'query',
      JSON.stringify({ title: name })
    );

    return this.categoryService.find(params).pipe(
      debounceTime(500),

      map((val) => {
        if (val.length === 0) {
          return null;
        } else {
          return { categoryExist: true };
        }
      })
    );
  };
}
