import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-log',
  templateUrl: './input-log.component.html',
  styleUrls: ['./input-log.component.scss'],
})
export class InputLogComponent implements OnInit, OnChanges {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() type = 'text';
  @Input() placeholder
  constructor() { }

  ngOnInit(): void { }

  get form() {
    return this.parentForm.controls;
  }

  ngOnChanges() { }
}
