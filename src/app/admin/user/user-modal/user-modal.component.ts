import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  @Input() showModal: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Input() user: any
  form: FormGroup
  submitted = false;

  constructor(private fb: FormBuilder) { }

  ngOnChanges() { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [this.user.username, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, Validators.required],
      password: [this.user.password, Validators.required],
    });
  }

  onClose() {
    this.showModalChange.emit(!this.showModal);
  }

  onSubmit() {


    this.onClose();
  }

  ngOnDestroy() { }
}
