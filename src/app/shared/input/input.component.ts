import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() inputType = 'input';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() inputPrimeNg: boolean;
  @Input() primeNgAddon: string;
  id: number;
  constructor() {}

  ngOnInit(): void {
    this.id = this.generateId();
  }

  generateId() {
    return Math.random();
  }
}
