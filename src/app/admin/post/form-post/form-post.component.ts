import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, Subscription } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { Category, Post } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Input() mode: string;
  @Output() valueForm = new EventEmitter<Post>();
  nameCategory: Partial<Category>[];

  idSelect: string;
  sub: Subscription;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryService
      .find()
      .pipe(
        mergeMap((val) => from(val)),
        map((val) => ({
          _id: val['_id'],
          title: val['title'],
        })),
        toArray()
      )
      .subscribe((val) => {
        this.nameCategory = val;
      });
  }

  ngOnChanges() {}

  ngOnInit(): void {}

  onChange(e) {
    const name = e.target.value;
    const list = this.nameCategory.find((item) => item.title === name);

    if (list) this.idSelect = list._id;
  }

  onSubmit() {
    const newPost: Post = { ...this.parentForm.value };
    newPost.idcha = this.idSelect;
    this.valueForm.emit(newPost);
    this.idSelect = null;
  }
}
