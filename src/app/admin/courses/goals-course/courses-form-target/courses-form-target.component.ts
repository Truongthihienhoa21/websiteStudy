import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-courses-form-target',
  templateUrl: './courses-form-target.component.html',
  styleUrls: ['./courses-form-target.component.scss'],
})
export class CoursesFormTargetComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() field: string;
  @Input() label: string;
  @Input() placeholder: string;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  get formLists() {
    return this.parentForm.get(this.field) as FormArray;
  }

  addTarget() {
    this.formLists.push(this.fb.group({ content: '' }));
  }

  onDelete(index) {
    this.formLists.removeAt(index);
  }
}
