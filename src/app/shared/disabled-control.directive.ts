import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '([formControlName], [formControl], input)[disabledControl]',
})
export class DisabledControlDirective {
  constructor(private ngControl: NgControl) {}

  @Input() set disabledControl(state: boolean) {
    const action = state ? 'disable' : 'enable';
    this.ngControl.control[action];
  }
}
