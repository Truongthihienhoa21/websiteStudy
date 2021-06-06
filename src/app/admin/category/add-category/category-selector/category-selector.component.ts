import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/model/model';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})
export class CategorySelectorComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Output() added = new EventEmitter<Category>();

  currentid: string = '';

  constructor() {}

  ngOnInit(): void {}

  get formSelector(): FormGroup {
    return this.parentForm.get('selector') as FormGroup;
  }

  onAdd() {
    this.formSelector.patchValue({
      idparent: this.currentid,
    });

    this.added.emit(this.formSelector.value);
    this.formSelector.reset();
  }
}
