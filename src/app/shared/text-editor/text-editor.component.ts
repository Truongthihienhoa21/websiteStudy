import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Input() mode = 'admin';
  @Input() height = 500;
  @Input() formControlName = 'html';
  plugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount emoticons',
  ];
  toolbar =
    'undo redo | formatselect | bold italic backcolor | \
  alignleft aligncenter alignright alignjustify | \
  bullist numlist outdent indent | removeformat | help emoticons preview';

  menubar = true;
  constructor() {}

  ngOnChanges() {
    if (this.mode !== 'admin') {
      this.menubar = false;
      this.height = 200;
      this.toolbar = ' emoticons preview image code';
    }
  }

  ngOnInit(): void {}
}
