import { Injectable } from '@angular/core';
import { FormGroup, Validator } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CheckPassWord implements Validator {
  constructor() {}
  validate = (formGroup: FormGroup) => {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    if (password !== confirmPassword) {
      return { passwordNotMatch: true };
    } else {
      return null;
    }
  };
}
