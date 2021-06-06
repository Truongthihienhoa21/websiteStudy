import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-form-category',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.scss'],
})
export class FormCategoryComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Output() idparentChange = new EventEmitter<string>();
  categorys: Partial<Category>[];
  sub: Subscription;
  constructor(private categoryService: CategoryService) {
    this.sub = this.categoryService.getCategoryForEdit().subscribe((val) => {
      this.categorys = val;
    });
  }

  ngOnInit(): void {}

  onChange(e) {
    const name = e.target.value;
    const category = this.categorys.find((item) => item.title === name);

    if (category) {
      this.idparentChange.emit(category._id);
    } else if (this.parentForm.get('group').value !== '') {
      this.parentForm.get('group').setErrors({
        notFoundCategory: true,
      });
    } else {
      this.idparentChange.emit('');
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
