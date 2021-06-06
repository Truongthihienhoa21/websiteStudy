import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Output() removed = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  get categoryLists() {
    return (this.parentForm.get('list') as FormArray).controls;
  }

  onDelete(item: FormGroup, index: number) {
    this.removed.emit({ item, index });
  }
}
